from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import pytz
from devices.models import Device, ControlRelationship
from Adafruit_IO import Client
from django.utils import timezone
from dotenv import load_dotenv
import os 
import json
import requests
from users.models import User

load_dotenv()

aio_username = os.environ.get('ADAFRUIT_AIO_USERNAME')
aio_key = os.environ.get('ADAFRUIT_AIO_KEY')
client = Client(aio_username, aio_key)

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

def get_formatted_created_at(created_at):
        return created_at.strftime('%Y-%m-%d %H:%M:%S').replace("T", " ")

@csrf_exempt
def get_device_by_id(request, device_id):
    if request.method == 'GET':
        devices = Device.objects.get(id=device_id)

        return JsonResponse({  
             'status': 200,
             'message': 'success',
             'data': {
                 'id': devices.id,
                 'device_name': devices.devicename,
                 'device_type': devices.devicetype,
                 'device_status': devices.status,
             }
        })
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def update_device(request, device_id):
    if request.method == 'PATCH':
        data = json.loads(request.body)
        try: 
            updated_device = Device.objects.get(id=device_id)
            
            if data.get('status') == True:
                updated_device.status = 1
            else:
                updated_device.status = 0
            
            updated_device.save()
            
            # Send data to Adafruit and get feed data
            client.send_data(updated_device.devicetype, updated_device.status)
        
            new_history = ControlRelationship.objects.create(
                user = User.objects.get(UserID=data.get('userID')),
                device = updated_device,
                device_status = updated_device.status,
            )
            new_history.created_at = get_formatted_created_at(new_history.created_at)
            new_history.save()
            
            print("new_history:", new_history.created_at)
            return JsonResponse({
                'status': 200,
                'message': 'Device updated successfully',
                'data': {
                    'id': updated_device.id,
                    'device_name': updated_device.devicename,
                    'device_type': updated_device.devicetype,
                    'device_status': updated_device.status,
                }
            })
        except Device.DoesNotExist:
            return JsonResponse({
                'status': 404,
                'message': 'Device not found',
            })


