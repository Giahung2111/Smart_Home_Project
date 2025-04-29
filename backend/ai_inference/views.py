import cv2
from ultralytics import YOLO
import torch
import torch.nn as nn
import numpy as np
from collections import defaultdict
import torchvision.transforms as transforms
from PIL import Image
import os
import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CameraActionSerializer
from .serializers import AuthorizedUserSerializer
from .serializers import MicrophoneActionSerializer
from .models import AuthorizedUser
import speech_recognition as sr
import pyttsx3
from datetime import datetime
import json
import re

### ======================= FACE RECOGNITION MODEL =============================
# Định nghĩa mô hình
class EmbeddingNet(nn.Module):
    def __init__(self):
        super(EmbeddingNet, self).__init__()
        self.conv1 = nn.Conv2d(3, 64, kernel_size=10)
        self.pool1 = nn.MaxPool2d(2, 2, ceil_mode=True)
        self.conv2 = nn.Conv2d(64, 128, kernel_size=7)
        self.pool2 = nn.MaxPool2d(2, 2, ceil_mode=True)
        self.conv3 = nn.Conv2d(128, 128, kernel_size=4)
        self.pool3 = nn.MaxPool2d(2, 2, ceil_mode=True)
        self.conv4 = nn.Conv2d(128, 256, kernel_size=4)
        self.flatten = nn.Flatten()
        self.dropout1 = nn.Dropout(0.2)
        self.dropout2 = nn.Dropout(0.3)
        self.fc1 = nn.Linear(256 * 6 * 6, 4096)
        self.relu = nn.ReLU()
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.conv1(x))
        x = self.pool1(x)
        x = self.relu(self.conv2(x))
        x = self.pool2(x)
        x = self.relu(self.conv3(x))
        x = self.pool3(x)
        x = self.relu(self.conv4(x))
        x = self.dropout1(x)
        x = self.flatten(x)
        x = self.dropout2(x)
        x = self.sigmoid(self.fc1(x))
        return x

class L1Dist(nn.Module):
    def __init__(self):
        super(L1Dist, self).__init__()

    def forward(self, input_embedding, validation_embedding):
        return torch.abs(input_embedding - validation_embedding)

class SiameseNetwork(nn.Module):
    def __init__(self, embedding_net):
        super(SiameseNetwork, self).__init__()
        self.embedding_net = embedding_net
        self.L1_dist = L1Dist()
        self.fc = nn.Linear(4096, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, input_img, validation_img):
        input_embedding = self.embedding_net(input_img)
        validation_embedding = self.embedding_net(validation_img)
        distances = self.L1_dist(input_embedding, validation_embedding)
        fully_connected = self.fc(distances)
        output = self.sigmoid(fully_connected)
        return output

# Khởi tạo device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

transform = transforms.Compose([
    transforms.ToTensor(),  # Chuyển sang tensor và chuẩn hóa [0, 1]
])

def img_preprocess(frame):
    if frame is None or frame.size == 0 or frame.shape[0] == 0 or frame.shape[1] == 0:
        print("Vùng khuôn mặt rỗng sau khi crop")
        return None, None
    
    face = cv2.resize(frame, (100, 100))
    face_rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
    face_pil = Image.fromarray(face_rgb)
    face_tensor = transform(face_pil)
    print(f"Shape after transform: {face_tensor.shape}")
    face_display = cv2.cvtColor(face_rgb, cv2.COLOR_RGB2BGR)
    return face_tensor.unsqueeze(0).to(device), face_display

class CameraControl(APIView):
    def post(self, request):
        serializer = CameraActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data['action']
            if action == "on":
                try:
                    # Load mô hình YOLO
                    model = YOLO("C:\\Python\\Smart_home_project\\Smart_Home_Project\\models\\yolo_best.pt")
                    siamese_model_path = 'C:\\Python\\Smart_home_project\\Smart_Home_Project\\models\\siamese_best.pt'
                    checkpoint = torch.load(siamese_model_path, map_location=device)
                    embedding_net = EmbeddingNet()
                    siamese_model = SiameseNetwork(embedding_net).to(device)
                    siamese_model.load_state_dict(checkpoint['model_state_dict'])
                    siamese_model.eval()

                    # Tiền xử lý anchor database với YOLO
                    anchor_database_path = "C:\\Python\\Smart_home_project\\Smart_Home_Project\\data\\anchor_database_onehot"
                    anchor_imgs = {}
                    anchor_filenames = {}
                    for identity in os.listdir(anchor_database_path):
                        identity_path = os.path.join(anchor_database_path, identity)
                        if os.path.isdir(identity_path):
                            anchor_imgs[identity] = []
                            anchor_filenames[identity] = []
                            anchor_file = os.listdir(identity_path)[0] if os.listdir(identity_path) else None
                            if anchor_file and anchor_file.endswith(('.jpg', '.jpeg', '.png')):
                                anchor_path = os.path.join(identity_path, anchor_file)
                                img = cv2.imread(anchor_path)
                                if img is None:
                                    print(f"Không thể đọc ảnh: {anchor_path}")
                                    continue
                                # Dùng YOLO để phát hiện khuôn mặt
                                results = model(img)
                                face_img = None
                                best_conf = 0.0
                                for result in results:
                                    boxes = result.boxes
                                    for box in boxes:
                                        cls_id = int(box.cls[0])
                                        conf = float(box.conf[0])
                                        if conf < 0.5 or model.names[cls_id] != "without_mask":
                                            continue
                                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                                        h, w = img.shape[:2]
                                        if x1 >= x2 or y1 >= y2:
                                            print(f"Tọa độ không hợp lệ: x1={x1}, x2={x2}, y1={y1}, y2={y2}")
                                            continue
                                        x1, x2 = max(0, x1), min(w, x2)
                                        y1, y2 = max(0, y1), min(h, y2)
                                        if x1 >= x2 or y1 >= y2:
                                            print(f"Tọa độ sau điều chỉnh không hợp lệ")
                                            continue
                                        crop_width = x2 - x1
                                        crop_height = y2 - y1
                                        if crop_width < 10 or crop_height < 10:
                                            print(f"Vùng crop quá nhỏ: width={crop_width}, height={crop_height}")
                                            continue
                                        if conf > best_conf:
                                            best_conf = conf
                                            face_img = img[y1:y2, x1:x2]
                                if face_img is None:
                                    print(f"Không tìm thấy khuôn mặt hợp lệ trong ảnh anchor: {anchor_path}")
                                    continue
                                img_tensor, _ = img_preprocess(face_img)
                                if img_tensor is not None:
                                    anchor_imgs[identity].append(img_tensor)
                                    anchor_filenames[identity].append(anchor_file)

                    if not any(anchor_imgs.values()):
                        raise ValueError("Không có ảnh anchor hợp lệ trong database")

                    threshold = 0.8
                    result_label = "Press Space to capture"
                    result_prob = 0.0
                    result_identity = ""
                    result_color = (255, 255, 255)
                    processed_img = None
                    debug_dir = 'application_data/input_image'
                    os.makedirs(debug_dir, exist_ok=True)

                    # Mở camera
                    cap = cv2.VideoCapture(0)
                    try:
                        if not cap.isOpened():
                            raise ValueError("Không thể mở camera")
                        while cap.isOpened():
                            ret, frame = cap.read()
                            if not ret:
                                raise ValueError("Không thể đọc frame từ camera")

                            # Resize frame để tăng tốc độ
                            frame = cv2.resize(frame, (640, 480))
                            h, w = frame.shape[:2]

                            # Dự đoán với YOLO
                            results = model(frame)
                            if not results or not results[0].boxes:
                                message = "No face detected"
                                cv2.putText(frame, message, (50, 50),
                                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                                cv2.imshow('Mask Detection Demo', frame)
                                continue

                            face_img = None
                            message = "No face detected"
                            for result in results:
                                boxes = result.boxes
                                for box in boxes:
                                    cls_id = int(box.cls[0])
                                    conf = float(box.conf[0])
                                    if conf < 0.5:
                                        continue
                                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                                    # Kiểm tra tọa độ
                                    if x1 >= x2 or y1 >= y2:
                                        print(f"Tọa độ không hợp lệ: x1={x1}, x2={x2}, y1={y1}, y2={y2}")
                                        continue
                                    x1, x2 = max(0, x1), min(w, x2)
                                    y1, y2 = max(0, y1), min(h, y2)
                                    if x1 >= x2 or y1 >= y2:
                                        print(f"Tọa độ sau điều chỉnh không hợp lệ")
                                        continue

                                    # Kiểm tra kích thước vùng crop
                                    crop_width = x2 - x1
                                    crop_height = y2 - y1
                                    if crop_width < 10 or crop_height < 10:
                                        print(f"Vùng crop quá nhỏ: width={crop_width}, height={crop_height}")
                                        continue

                                    label = model.names[cls_id]
                                    color = (255, 255, 0) if label == 'with_mask' else (0, 0, 255)
                                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                                    cv2.putText(frame, f'{label} {conf:.2f}', (x1, y1 - 10),
                                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

                                    if label == "with_mask":
                                        message = "Please take off your mask!"
                                        cv2.putText(frame, message, (50, 50),
                                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                                    elif label == "without_mask":
                                        message = "Good"
                                        face_img = frame[y1:y2, x1:x2]

                            # Hiển thị thông tin trên frame
                            cv2.putText(frame, f"{result_label} ({result_prob:.2f})", (10, 30),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, result_color, 2)
                            if result_identity:
                                cv2.putText(frame, f"Identity: {result_identity}", (10, 60),
                                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, result_color, 2)

                            cv2.imshow('Mask Detection Demo', frame)
                            if processed_img is not None:
                                cv2.imshow('Processed Face', processed_img)

                            key = cv2.waitKey(1) & 0xFF
                            if key == ord('q'):
                                break
                            elif key == ord(' '):
                                timestamp = time.strftime("%Y%m%d_%H%M%S")
                                debug_path = os.path.join(debug_dir, f'webcam_capture_{timestamp}.jpg')
                                if face_img is not None:
                                    cv2.imwrite(debug_path, face_img)
                                else:
                                    cv2.imwrite(debug_path, frame)

                                response = {}
                                if message == "Please take off your mask!":
                                    response = {
                                        "message": message,
                                        "identity": "",
                                        "probability": 0.0
                                    }
                                elif face_img is None:
                                    response = {
                                        "message": "No face detected",
                                        "identity": "",
                                        "probability": 0.0
                                    }
                                else:
                                    webcam_img, processed_img = img_preprocess(face_img)
                                    if webcam_img is None:
                                        response = {
                                            "message": "No face detected",
                                            "identity": "",
                                            "probability": 0.0
                                        }
                                    else:
                                        best_identity = ""
                                        best_prob = 0.0
                                        for identity, anchor_list in anchor_imgs.items():
                                            if not anchor_list:
                                                continue
                                            anchor_img = anchor_list[0]
                                            webcam_batch = webcam_img
                                            with torch.no_grad():
                                                output = siamese_model(anchor_img, webcam_batch)
                                                prob = output.squeeze().cpu().item()
                                            if prob > best_prob:
                                                best_prob = prob
                                                best_identity = identity

                                        if best_prob > threshold:
                                            result_label = "Valid Face"
                                            result_prob = best_prob
                                            result_identity = best_identity
                                            result_color = (0, 255, 0)
                                        else:
                                            result_label = "Invalid Face"
                                            result_prob = best_prob
                                            result_identity = ""
                                            result_color = (0, 0, 255)

                                        response = {
                                            "message": message,
                                            "identity": result_identity,
                                            "probability": result_prob
                                        }

                                # In response ra console và tiếp tục chạy
                                print("Response:", response)

                    finally:
                        cap.release()
                        cv2.destroyAllWindows()
                    return Response(
                        {"message": "Camera stopped", "identity": "", "probability": 0.0},
                        status=status.HTTP_200_OK
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Lỗi khi xử lý camera: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                cv2.destroyAllWindows()
                return Response(
                    {"message": "Camera off"},
                    status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

### =============================================================================


### ======================== SPEECH RECOGNITION MODEL ===========================
class NERModel(nn.Module):
    """Standalone model class that matches the trained architecture"""
    def __init__(self, vocab_size, embedding_dim, hidden_dim, tagset_size, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(
            embedding_dim, 
            hidden_dim//2, 
            num_layers=2,
            bidirectional=True, 
            batch_first=True
        )
        self.fc = nn.Linear(hidden_dim, tagset_size)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, tags=None):
        emb = self.dropout(self.embedding(x))
        lstm_out, _ = self.lstm(emb)
        logits = self.fc(self.dropout(lstm_out))
        
        if tags is not None:
            loss_fn = nn.CrossEntropyLoss(ignore_index=0)
            active_loss = tags.view(-1) != 0
            active_logits = logits.view(-1, logits.shape[-1])[active_loss]
            active_labels = tags.view(-1)[active_loss]
            return loss_fn(active_logits, active_labels)
        return torch.argmax(logits, dim=-1)

# Speech recognition components
class SpeechRecognizer:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 180)
        self.engine.setProperty('volume', 0.9)
        self.recognizer = sr.Recognizer()
        self.mic = sr.Microphone()

    def speak(self, text):
        self.engine.say(text)
        self.engine.runAndWait()

    def calibrate_noise(self, duration=1):
        print(f"Calibrating ambient noise for {duration} second(s)...")
        with self.mic as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=duration)
        print(f"Energy threshold set to: {self.recognizer.energy_threshold}")

    def recognize_speech(self, timeout=5, phrase_time_limit=5):
        try:
            print("Listening...")
            with self.mic as source:
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
            print("Recognizing...")
            return self.recognizer.recognize_google(audio, language="en-US")
        except sr.WaitTimeoutError:
            print("No speech detected within time.")
            return None
        except sr.UnknownValueError:
            print("Could not understand the audio.")
            return None
        except sr.RequestError as e:
            print(f"API error: {e}")
            return None

def load_resources(model_path, word2idx_path, tag2idx_path):
    """Load trained model and vocabularies"""
    try:
        with open(word2idx_path, 'r', encoding='utf-8') as f:
            word2idx = json.load(f)
        with open(tag2idx_path, 'r', encoding='utf-8') as f:
            tag2idx = json.load(f)
        
        idx2tag = {v: k for k, v in tag2idx.items()}
        
        model = NERModel(len(word2idx), 128, 256, len(tag2idx))
        model.load_state_dict(torch.load(model_path))
        model.eval()
        
        return model, word2idx, idx2tag
    except Exception as e:
        print(f"Error loading resources: {str(e)}")
        raise

def preprocess_text(text):
    """Clean and normalize input text"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', '', text)
    return text

def predict_entities(model, text, word2idx, idx2tag):
    """Predict entities from text input"""
    words = preprocess_text(text).split()
    if not words:
        return []
    
    special_phrases = [
        ('all lights', 'device'),
        ('turn on', 'action'),
        ('turn off', 'action'),
        ('switch on', 'action'),
        ('switch off', 'action'),
        ('open', 'action'),
        ('close', 'action'),
        ('lock', 'action'),
        ('unlock', 'action'),
        ('lights', 'device'),
        ('light', 'device'),
        ('fan', 'device'),
        ('door', 'device'),
        ('home', 'room'),
        ('house', 'room'),
        ('whole home', 'room'),
        ('living room', 'room'),
        ('kitchen', 'room'),
        ('bedroom', 'room')
    ]
    
    entities = []
    i = 0
    n = len(words)
    
    while i < n:
        matched = False
        for phrase, label in sorted(special_phrases, key=lambda x: len(x[0]), reverse=True):
            phrase_words = phrase.split()
            if words[i:i+len(phrase_words)] == phrase_words:
                entities.append({
                    'text': phrase,
                    'type': label,
                    'start': i,
                    'end': i + len(phrase_words)
                })
                i += len(phrase_words)
                matched = True
                break
        
        if not matched:
            word_idx = word2idx.get(words[i], word2idx["<UNK>"])
            with torch.no_grad():
                output = model(torch.tensor([[word_idx]], dtype=torch.long))
                tag = idx2tag[output[0][0].item()]
            
            if tag != 'O':
                entities.append({
                    'text': words[i],
                    'type': tag[2:],
                    'start': i,
                    'end': i+1
                })
            i += 1
    
    return entities

def validate_entities(entities):
    """Validate against business rules"""
    errors = []
    devices = [e for e in entities if e['type'] == 'device']
    actions = [e for e in entities if e['type'] == 'action']
    rooms = [e for e in entities if e['type'] == 'room']
    
    valid_devices = ['light', 'lights', 'fan', 'door']
    if not devices:
        errors.append("Missing device")
    else:
        for device in devices:
            if device['text'] not in valid_devices:
                errors.append(f"Invalid device: {device['text']}")
    
    if not actions:
        errors.append("Missing action")
    
    global_rooms = ['home', 'house', 'whole home']
    specific_rooms = ['living room', 'kitchen', 'bedroom']
    
    if rooms:
        device_type = devices[0]['text'] if devices else None
        if device_type in ['fan', 'door'] and rooms[0]['text'] not in global_rooms:
            errors.append(f"Cannot specify room for {device_type}")
        elif device_type == 'light' and rooms[0]['text'] not in global_rooms + specific_rooms:
            errors.append(f"Invalid room for light: {rooms[0]['text']}")
    
    return errors

def process_command(model, word2idx, idx2tag, text):
    """Process command and return formatted result"""
    entities = predict_entities(model, text, word2idx, idx2tag)
    errors = validate_entities(entities)
    
    return {
        'command': text,
        'entities': entities,
        'is_valid': len(errors) == 0,
        'errors': errors,
        'timestamp': datetime.now().isoformat()
    }

def save_results_to_json(results, output_dir="output"):
    """Save test results to JSON file with timestamp"""
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{output_dir}/test_results_{timestamp}.json"
    
    output = {
        'metadata': {
            'test_time': datetime.now().isoformat(),
            'total_commands': len(results),
            'valid_commands': sum(1 for r in results if r['is_valid']),
            'invalid_commands': sum(1 for r in results if not r['is_valid'])
        },
        'results': results
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\nTest results saved to: {filename}")
    return filename

def save_audio_log(text, recognized_text, output_dir="audio_logs"):
    """Save audio input and recognition result"""
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{output_dir}/audio_{timestamp}.json"
    
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'original_input': text,
        'recognized_text': recognized_text
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(log_entry, f, indent=2, ensure_ascii=False)
    
    return filename

def process_command_voice(model, word2idx, idx2tag, speech_recognizer, max_attempts=3):
    """Process voice commands with retry for invalid inputs"""
    attempts = 0
    results = []
    
    while attempts < max_attempts:
        speech_recognizer.speak("Please say your command")
        recognized_text = speech_recognizer.recognize_speech()
        
        if recognized_text is None:
            attempts += 1
            remaining = max_attempts - attempts
            if remaining > 0:
                speech_recognizer.speak(f"Sorry, please try again. You have {remaining} more attempts")
            continue
            
        print(f"\nRecognized command: {recognized_text}")
        
        result = process_command(model, word2idx, idx2tag, recognized_text)
        results.append(result)
        
        # Save audio log
        save_audio_log("voice_input", recognized_text)
        
        print("\nCommand Analysis:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        if result['is_valid']:
            speech_recognizer.speak("Command is valid. Processing complete.")
            return results
        else:
            attempts += 1
            remaining = max_attempts - attempts
            if remaining > 0:
                error_msg = " ".join(result['errors'])
                print(f"\nInvalid command. Errors: {error_msg}")
                speech_recognizer.speak(f"Invalid command. {error_msg}. You have {remaining} more attempts")
            else:
                speech_recognizer.speak("Maximum attempts reached. Command rejected.")
                print("\nMaximum invalid attempts reached. Command rejected.")
    
    return results

class MicrophoneControl(APIView):
    def post(self, request):
        serializer = MicrophoneActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data['action']
            if action == "on":
                OUTPUT_FILE = "output/voice_test_result.json"
                try:
                    # Initialize speech recognizer
                    speech_recognizer = SpeechRecognizer()
                    speech_recognizer.calibrate_noise()
                    
                    # Load NLP resources
                    model, word2idx, idx2tag = load_resources(
                        "../models/ner.pth",
                        "../models/word2idx.json",
                        "../models/tag2idx.json"
                    )
                
                    speech_recognizer.speak("Voice enabled smart home system initialized")
                    
                    all_results = []
                    
                    results = process_command_voice(model, word2idx, idx2tag, speech_recognizer)
                            
                    all_results.extend(results)
                        

                    # Save all results to JSON
                    if all_results:
                        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                            json.dump(all_results, f, indent=2, ensure_ascii=False)
                        print(f"\nAll results saved to: {OUTPUT_FILE}")
                    
                    speech_recognizer.speak("Session ended. Goodbye")
                    print("\nSession ended.")
                    return Response(all_results, status=status.HTTP_200_OK)
                    
                except Exception as e:
                    print(f"\nError during processing: {str(e)}")
                    speech_recognizer.speak("An error occurred. Please check the system")
                    return Response({"error": f"Lỗi khi xử lý âm thanh: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



### ============================================================================


class FaceRecognitionAllowed(APIView):
    def get(self, request):
        authorized_users = AuthorizedUser.objects.all()
        serializer = AuthorizedUserSerializer(authorized_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 