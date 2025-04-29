from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from devices.models import Device, ControlRelationship
from users.models import User
from rooms.models import Room
from utils.adafruit_io_operations import *
import os
import sys
import random
import time
from Adafruit_IO import MQTTClient
import requests
from dotenv import load_dotenv

load_dotenv()

aio_feed_light_1 = os.environ.get('ADAFRUIT_AIO_FEED_LIGHT1')
aio_username = os.environ.get('ADAFRUIT_AIO_USERNAME')
aio_key = os.environ.get('ADAFRUIT_AIO_KEY')

client = MQTTClient(aio_username, aio_key)
client.on_connect = connected(client, aio_feed_light_1)
client.on_subscribe = subscribe
client.on_disconnect = disconnected
client.on_message = message
client.connect()
client.loop_background()

def get_feed_value(feed_id):
    url = f'https://io.adafruit.com/api/v2/{aio_username}/feeds/{feed_id}'
    try:
        response = requests.get(url, headers={'X-AIO-Key': aio_key})
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

while True:
    value = int(random.random() < 0.5)
    print("Update:", value)
    client.publish(aio_feed_light_1, value)
    time.sleep(10)
    @csrf_exempt
    def get_history(request):
        if request.method == 'GET':
            try:
                control_history = ControlRelationship.objects.select_related('user', 'device').all()
                light1_feed = get_feed_value(aio_feed_light_1)
                print("Light1 feed value:", light1_feed)  # Debug print
                if not control_history:
                    return JsonResponse({
                        'status': 404,
                        'message': 'No history found',
                        'data': []
                    })

                history_data = []
                for history in control_history:
                    room = Room.objects.filter(device_id=history.device).first()
                    if room:
                        room_name = room.RoomName
                    data = {
                        'id': history.id,
                        'device_name': history.device.devicename,
                        'device_type': history.device.devicetype,
                        'device_status': history.device.status,
                        'user_name': history.user.Username,
                        'user_role': history.user.Role,
                        'created_at': history.device.createdat.strftime('%Y-%m-%d %H:%M:%S'),
                        'room_name': room_name if room else None,
                    }
                    history_data.append(data)
                    print(f"Processing record: {data}")  # Debug print
                
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


