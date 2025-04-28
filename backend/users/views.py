from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User
import json
# Create your views here.

@csrf_exempt
def login(request):
    data = json.loads(request.body)
    print("data: ", data)
    credential = data.get('GoogleCredential')

    if credential == True:
        try:
            email = data.get('Email')
            username = data.get('Username')
            fullname = data.get('FullName')
            password = data.get('Password')
            status = data.get('Status')
            role = data.get('Role')
            phone = data.get('Phone')
            avatar = data.get('Avatar')

            # Try to find existing user
            try:
                user = User.objects.get(Email=email)
                return JsonResponse({
                    'status': 200,
                    'message': 'Login successful',
                    'data': {
                        'id': user.id,
                        'username': user.Username,
                        'avatar': user.Avatar,
                        'role': user.Role,
                    }
                })
            except User.DoesNotExist:
                new_user = User.objects.create(
                    Username=username,
                    FullName=fullname,
                    Email=email,
                    GoogleCredential=credential,
                    Password=password,
                    Status=status,
                    Role=role,
                    Phone=phone,
                    Avatar=avatar
                )
                new_user.save()
                return JsonResponse({
                    'status': 201,
                    'message': 'User created successfully',
                    'data': {
                        'id': user.id,
                        'username': new_user.Username,
                        'avatar': new_user.Avatar,
                        'role': new_user.Role,
                    }
                })
        except Exception as e:
            return JsonResponse({
                'status': 500,
                'message': str(e)
            })
    else:
        username = data.get('Username')
        password = data.get('Password')
        status = data.get('Status')
        avatar = data.get('Avatar')
        
        user = User.objects.filter(Username=username, Password=password).first()
        if user is not None:
            user.Status = status
            user.save()
            return JsonResponse({
                'status': 200,
                'message': 'Login successful',
                'data': {
                    'id': user.id,
                    'avatar': user.Avatar,
                    'role': user.Role,
                }
            })
        else:
            return JsonResponse({
                'status': 401,
                'message': 'Wrong username or password',
            })
            
@csrf_exempt         
def register(request):
    data = json.loads(request.body)
    
    username = data.get('Username')
    password = data.get('Password')
    email = data.get('Email')
    status = data.get('Status')
    fullname = data.get('FullName')
    role = data.get('Role')
    credential = data.get('GoogleCredential')
    phone = data.get('Phone')
    avatar = data.get('Avatar')
    
    if credential == True:
        user = User.objects.create(
            Username=username,
            Email=email,
            Password=password,
            Status=status,
            FullName=fullname,
            Role=role,
            Phone=phone,
            GoogleCredential=credential,
            Avatar=avatar
        )
        
        return JsonResponse({
            'status': 201,
            'message': 'User created successfully',
            'data': {
                'id': user.id,
                'username': user.Username,
                'avatar': user.Avatar,
                'role': user.Role
            }
        })
    else:
        user = User.objects.create(
            Username=username,
            Email=email,
            Password=password,
            Status=status,
            FullName=fullname,
            Role=role,
            Phone=phone,
            GoogleCredential=credential,
            Avatar=avatar
        )
        
        return JsonResponse({
            'status': 201,
            'message': 'User created successfully',
            'data': {
                'id': user.id,
                'username': user.Username,
                'avatar': user.Avatar,
                'role': user.Role
            }
        })
        
@csrf_exempt
def get_user_data(request, id):
    try:
        user = User.objects.get(id=id)
        return JsonResponse({
            'status': 200,
            'message': 'User data retrieved successfully',
            'data': {
                'email': user.Email,
                'phone': user.Phone,
            }
        })
    except User.DoesNotExist:
        return JsonResponse({
            'status': 404,
            'message': 'User not found',
        })
        
@csrf_exempt
def get_all_users(request):
    users = User.objects.all().values('id', 'FullName', 'Phone', 'Role', 'Status', 'Avatar')

    return JsonResponse({
        'status': 200,
        'message': 'All users retrieved successfully',
        'data': list(users),
    })
    
@csrf_exempt
def update_user(request, id):
    data = json.loads(request.body)
    print("data: ", data)
    current_user = User.objects.get(id=id)
    current_user.Username = data.get('Username')
    current_user.Phone = data.get('Phone')
    current_user.Email = data.get('Email')
    current_user.Role = data.get('Role')
    current_user.save()
    
    return JsonResponse({
        'status': 200,
        'message': 'User updated successfully',
    })

@csrf_exempt
def delete_user(request, id):
    try:
        deleted_user = User.objects.get(id=id)
        deleted_user.delete()
        
        return JsonResponse({
            'status': 200,
            'message': 'User deleted successfully',
        })
    except User.DoesNotExist:
        return JsonResponse({
            'status': 404,
            'message': 'User not found',
        })
        