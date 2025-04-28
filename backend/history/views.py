from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from devices.models import Device, ControlRelationship
from users.models import User
from rooms.models import Room
import os
from dotenv import load_dotenv

load_dotenv()

@csrf_exempt
def get_history(request):
    if request.method == 'GET':
        try:
            control_history = ControlRelationship.objects.select_related('user', 'device').all()
            
            if not control_history:
                return JsonResponse({
                    'status': 404,
                    'message': 'No history found',
                    'data': []
                })

            history_data = []
            for relationship in control_history:
                data = {
                    'device_name': relationship.device.devicename,
                    'device_type': relationship.device.devicetype,
                    'device_status': relationship.device.status,
                    'user_name': relationship.user.Username,
                    'created_at': relationship.device.createdat.strftime('%Y-%m-%d %H:%M:%S')
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


