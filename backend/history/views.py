from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests
from devices.models import Device, ControlRelationship
from users.models import User
from rooms.models import Room
import os 
from dotenv import load_dotenv

load_dotenv()

aio_username = os.environ.get('ADAFRUIT_AIO_USERNAME')
aio_key = os.environ.get('ADAFRUIT_AIO_KEY')
def get_feed_value(feed_id):
    # print("feed_id:", feed_id)  # Debug print
    url = f'https://io.adafruit.com/api/v2/{aio_username}/feeds/{feed_id}'
    try:
        response = requests.get(url, headers={'X-AIO-Key': aio_key})
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

@csrf_exempt
def get_history(request):
    if request.method == 'GET':
        try:
            history_data = []
            control_history = ControlRelationship.objects.select_related('user', 'device').all()
            if not control_history:
                return JsonResponse({
                    'status': 404,
                    'message': 'No history found',
                    'data': []
                })

            for history in control_history:
                room = Room.objects.get(device_id=history.device.id)
                room_name = room.RoomName
                feed_data = get_feed_value(history.device.devicetype)
                data = {
                    'id': history.id,
                    'device_name': history.device.devicename,
                    'device_type': history.device.devicetype,
                    'device_status': history.device_status,
                    'user_name': history.user.Username,
                    'user_role': history.user.Role,
                    'created_at': str(history.created_at).replace("T", " "),
                    'room_name': room_name,
                }
                # print("history:", data)
                history_data.append(data)
            
            return JsonResponse({
                'status': 200,
                'message': 'Get history successfully',
                'data': history_data
            })
            
        except Exception as e:
            print(f"Error occurred: {str(e)}")  # Debug print
            return JsonResponse({
                'status': 500,
                'message': 'Internal server error',
                'error': str(e)
            }, status=500)


