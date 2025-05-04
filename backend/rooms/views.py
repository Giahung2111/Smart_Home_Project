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
                            'id': room.device_id.id,
                            'device_name': room.device_id.devicename,
                            'status': room.device_id.status,
                        }]
                    }
                else:
                    room_data[room.RoomName]['devices'].append({
                        'id': room.device_id.id,
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
            
@csrf_exempt
def get_room_by_name(request, room_name):
    if request.method == "GET":
        try:
            room = Room.objects.filter(RoomName=room_name).all()
            room_data = {}
            for data in room:
                if data.RoomName not in room_data:
                    room_data[data.RoomName] = {
                        'devices': [{
                            'id': data.device_id.id,
                            'device_name': data.device_id.devicename,
                            'device_type': data.device_id.devicetype,
                            'status': data.device_id.status,
                        }]
                    }
                else:
                    room_data[data.RoomName]['devices'].append({
                        'id': data.device_id.id,
                        'device_name': data.device_id.devicename,
                        'device_type': data.device_id.devicetype,
                        'status': data.device_id.status,
                    })

            return JsonResponse({
                'status': 200,
                'message': 'Get room by name successfully',
                'data': {room_name: room_data[room_name]}
            })
            
        except Room.DoesNotExist:
            return JsonResponse({
                'status': 404,
                'message': 'Room not found',
            })