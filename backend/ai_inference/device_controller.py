import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8000')

# Đọc cấu hình từ biến môi trường
DEVICE_IDS = json.loads(os.getenv('DEVICE_IDS', '{}'))
ROOM_DEVICE_MAPPING = json.loads(os.getenv('ROOM_DEVICE_MAPPING', '{}'))
DEVICE_TYPE_MAPPING = json.loads(os.getenv('DEVICE_TYPE_MAPPING', '{}'))
GLOBAL_ROOMS = json.loads(os.getenv('GLOBAL_ROOMS', '[]'))
SPECIFIC_ROOMS = json.loads(os.getenv('SPECIFIC_ROOMS', '[]'))
ACTION_STATUS_MAPPING = json.loads(os.getenv('ACTION_STATUS_MAPPING', '{}'))

class DeviceController:
    def __init__(self):
        self._validate_config()
        self.device_mapping = ROOM_DEVICE_MAPPING
        
    def _validate_config(self):
        """Kiểm tra tính hợp lệ của cấu hình"""
        if not DEVICE_IDS:
            raise ValueError("DEVICE_IDS configuration is missing")
        if not ROOM_DEVICE_MAPPING:
            raise ValueError("ROOM_DEVICE_MAPPING configuration is missing")
        if not DEVICE_TYPE_MAPPING:
            raise ValueError("DEVICE_TYPE_MAPPING configuration is missing")
        if not ACTION_STATUS_MAPPING:
            raise ValueError("ACTION_STATUS_MAPPING configuration is missing")
            
    def _validate_device_id(self, device_id):
        """Kiểm tra tính hợp lệ của device ID"""
        return str(device_id) in [str(id) for id in DEVICE_IDS.values()]
        
    def get_device_ids_for_command(self, room_name, device_type):
        """Lấy device IDs dựa trên tên phòng và loại thiết bị"""
        try:
            device_ids = []
            
            # Kiểm tra device type hợp lệ
            if device_type not in DEVICE_TYPE_MAPPING:
                print(f"Warning: Invalid device type '{device_type}'")
                return []
            
            # Nếu là thiết bị toàn cục (fan, door) hoặc điều khiển toàn bộ nhà
            if device_type in ['fan', 'door'] or room_name in GLOBAL_ROOMS:
                device_codes = DEVICE_TYPE_MAPPING.get(device_type, [])
                device_ids = [DEVICE_IDS[code] for code in device_codes if code in DEVICE_IDS]
                if not device_ids:
                    print(f"Warning: No devices found for type '{device_type}'")
                return device_ids
            
            # Nếu là điều khiển theo phòng cụ thể
            if room_name in self.device_mapping:
                device_codes = self.device_mapping[room_name]
                device_ids = [DEVICE_IDS[code] for code in device_codes if code in DEVICE_IDS]
                if not device_ids:
                    print(f"Warning: No devices found in room '{room_name}'")
                return device_ids
                
            print(f"Warning: Room '{room_name}' not found in configuration")
            return []
        except Exception as e:
            print(f"Error getting device IDs: {str(e)}")
            return []

    def control_device(self, device_id, action, user_id):
        """Điều khiển thiết bị thông qua API"""
        try:
            # Validate inputs
            if not self._validate_device_id(device_id):
                print(f"Warning: Invalid device ID '{device_id}'")
                return False
                
            if not user_id:
                print("Warning: Missing user ID")
                return False
                
            if action.lower() not in ACTION_STATUS_MAPPING:
                print(f"Warning: Invalid action '{action}'")
                return False
            
            status = ACTION_STATUS_MAPPING.get(action.lower(), False)
            
            # Gọi API với retry logic
            max_retries = 3
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    response = requests.patch(
                        f"{API_BASE_URL}/api/devices/update/{device_id}",
                        json={
                            "status": status,
                            "userID": user_id
                        },
                        timeout=5  # 5 seconds timeout
                    )
                    
                    if response.status_code == 200:
                        print(f"Successfully controlled device {device_id}")
                        return True
                    else:
                        print(f"Failed to control device {device_id}. Status code: {response.status_code}")
                        print(f"Response content: {response.text}")
                        return False
                        
                except requests.exceptions.Timeout:
                    print(f"Timeout controlling device {device_id}. Attempt {retry_count + 1}/{max_retries}")
                    retry_count += 1
                except requests.exceptions.RequestException as e:
                    print(f"Error controlling device {device_id}: {str(e)}")
                    return False
                    
            print(f"Failed to control device {device_id} after {max_retries} attempts")
            return False
            
        except Exception as e:
            print(f"Unexpected error controlling device {device_id}: {str(e)}")
            return False

    def process_voice_command(self, entities, user_id):
        """Xử lý lệnh giọng nói và gọi APIs tương ứng"""
        try:
            if not user_id:
                return {
                    "success": False,
                    "message": "User authentication required"
                }
                
            # Validate entities
            if not isinstance(entities, list):
                return {
                    "success": False,
                    "message": "Invalid entities format"
                }
            
            # Lấy thông tin từ entities
            devices = [e for e in entities if e['type'] == 'device']
            actions = [e for e in entities if e['type'] == 'action']
            rooms = [e for e in entities if e['type'] == 'room']
            
            if not devices or not actions:
                return {
                    "success": False,
                    "message": "Missing device or action information"
                }

            device_type = devices[0]['text']
            action = actions[0]['text']
            
            # Xử lý lệnh cho toàn bộ nhà
            if not rooms or rooms[0]['text'] in GLOBAL_ROOMS:
                if device_type in ['fan', 'door']:
                    # Đối với fan và door, chỉ điều khiển một thiết bị
                    device_ids = self.get_device_ids_for_command(None, device_type)
                else:
                    # Đối với đèn, điều khiển tất cả các đèn trong nhà
                    all_device_ids = []
                    for room in SPECIFIC_ROOMS:
                        room_devices = self.get_device_ids_for_command(room, device_type)
                        all_device_ids.extend(room_devices)
                    device_ids = all_device_ids

                if not device_ids:
                    return {
                        "success": False,
                        "message": f"No {device_type} devices found"
                    }

                results = []
                controlled_devices = []
                for device_id in device_ids:
                    success = self.control_device(device_id, action, user_id)
                    results.append(success)
                    if success:
                        controlled_devices.append(device_id)
                
                return {
                    "success": all(results),
                    "message": "Controlled all devices successfully" if all(results) else f"Successfully controlled {len(controlled_devices)}/{len(device_ids)} devices",
                    "devices_controlled": controlled_devices,
                    "total_devices": len(device_ids)
                }
            
            # Xử lý lệnh cho phòng cụ thể
            room = rooms[0]['text']
            if device_type in ['fan', 'door'] and room not in GLOBAL_ROOMS:
                return {
                    "success": False,
                    "message": f"Cannot control {device_type} in specific room"
                }
                
            device_ids = self.get_device_ids_for_command(room, device_type)
            
            if not device_ids:
                return {
                    "success": False,
                    "message": f"No {device_type} devices found in {room}"
                }
            
            results = []
            controlled_devices = []
            for device_id in device_ids:
                success = self.control_device(device_id, action, user_id)
                results.append(success)
                if success:
                    controlled_devices.append(device_id)
                
            return {
                "success": all(results),
                "message": f"Successfully controlled all devices in {room}" if all(results) else f"Successfully controlled {len(controlled_devices)}/{len(device_ids)} devices in {room}",
                "devices_controlled": controlled_devices,
                "total_devices": len(device_ids)
            }
            
        except Exception as e:
            print(f"Error processing voice command: {str(e)}")
            return {
                "success": False,
                "message": f"Error processing command: {str(e)}"
            } 