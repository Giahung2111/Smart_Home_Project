from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rooms.models import Room

def get_all_rooms(request):
    if request.method == 'GET':
        try:
            rooms = Room.objects.all()
            room_data = {}
            
            for room in rooms:
                if room.RoomName not in room_data:
                    room_data[room.RoomName] = {
                        'room_name': room.RoomName,
                        'devices': [{
                            'device_name': room.device_id.devicename,
                            'status': room.device_id.status,
                        }]
                    }
                else:
                    room_data[room.RoomName]['devices'].append({
                        'device_name': room.device_id.devicename,
                        'status': room.device_id.status,
                    })
                    
            return JsonResponse({
                'status': 200,
                'message': 'Get all rooms successfully',
                'data': list(room_data.values())
            })
        except Exception as e:
            return JsonResponse({
                'status': 500,
                'message': str(e),
                'data': []
            })