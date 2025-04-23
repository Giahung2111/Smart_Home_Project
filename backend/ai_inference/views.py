import cv2
from ultralytics import YOLO
import pyaudio
import wave
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AuthorizedUser
from .serializers import CameraActionSerializer, MicrophoneActionSerializer, AuthorizedUserSerializer
import time

class CameraControl(APIView):
    def post(self, request):
        serializer = CameraActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data['action']
            if action == "on":
                try:
                    # Load mô hình YOLO
                    model = YOLO("C:\\Python\\Smart_home_project\\Smart_Home_Project\\models\\yolo_best.pt")  # Đường dẫn tới file best.pt

                    # Mở camera
                    cap = cv2.VideoCapture(0)  # 0 là webcam mặc định
                    if not cap.isOpened():
                        return Response(
                            {"error": "Không thể mở camera"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )

                    # Chạy trong 60 giây (cho demo)
                    start_time = time.time()
                    message = "No face detected"  # Mặc định nếu không phát hiện khuôn mặt
                    while time.time() - start_time < 60:
                        ret, frame = cap.read()
                        if not ret:
                            cap.release()
                            cv2.destroyAllWindows()
                            return Response(
                                {"error": "Không thể đọc frame từ camera"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )

                        # Dự đoán với YOLO
                        results = model(frame)
                        for result in results:
                            boxes = result.boxes
                            for box in boxes:
                                cls_id = int(box.cls[0])
                                conf = float(box.conf[0])
                                x1, y1, x2, y2 = map(int, box.xyxy[0])

                                label = model.names[cls_id]
                                color = (255, 255, 0) if label == 'with_mask' else (0, 0, 255)

                                # Vẽ bounding box và nhãn (cho demo trực quan)
                                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                                cv2.putText(frame, f'{label} {conf:.2f}', (x1, y1 - 10),
                                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

                                # Xử lý theo nhãn
                                if label == "with_mask":
                                    message = "Please take off your mask !"
                                    cv2.putText(frame, message, (50, 50),
                                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                                elif label == "without_mask":
                                    message = "Good"
                                    # Lưu vùng khuôn mặt để tích hợp Face Recognition
                                    # face_img = frame[y1:y2, x1:x2]

                        # Hiển thị video (cho demo)
                        cv2.imshow('Mask Detection Demo', frame)
                        if cv2.waitKey(1) & 0xFF == ord('q'):  # Nhấn 'q' để thoát sớm
                            break

                    cap.release()
                    cv2.destroyAllWindows()
                    return Response(
                        {"message": message},
                        status=status.HTTP_200_OK
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Lỗi khi xử lý camera: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:  # action == "off"
                # Đóng camera và cửa sổ
                cv2.destroyAllWindows()
                return Response(
                    {"message": "Camera off"},
                    status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MicrophoneControl(APIView):
    def post(self, request):
        serializer = MicrophoneActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data['action']
            if action == "on":
                try:
                    # Ghi âm 10 giây bằng PyAudio
                    CHUNK = 1024
                    FORMAT = pyaudio.paInt16
                    CHANNELS = 1
                    RATE = 44100
                    RECORD_SECONDS = 10

                    p = pyaudio.PyAudio()
                    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
                    frames = []

                    for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
                        data = stream.read(CHUNK)
                        frames.append(data)

                    stream.stop_stream()
                    stream.close()
                    p.terminate()

                    # Lưu file âm thanh (cho demo)
                    wf = wave.open("demo_recording1.wav", 'wb')
                    wf.setnchannels(CHANNELS)
                    wf.setsampwidth(p.get_sample_size(FORMAT))
                    wf.setframerate(RATE)
                    wf.writeframes(b''.join(frames))
                    wf.close()

                    return Response(
                        {"message": "Microphone recorded for demo"},
                        status=status.HTTP_200_OK
                    )
                except Exception as e:
                    return Response(
                        {"error": f"Lỗi khi ghi âm: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:  # action == "off"
                # Giả lập tắt microphone
                return Response(
                    {"message": "Microphone off"},
                    status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FaceRecognitionAllowed(APIView):
    def get(self, request):
        authorized_users = AuthorizedUser.objects.all()
        serializer = AuthorizedUserSerializer(authorized_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)