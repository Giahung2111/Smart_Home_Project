from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User
import json

@csrf_exempt
def login(request):
    data = json.loads(request.body)
    print("data: ", data)
    credential = data.get('GoogleCredential')

    if credential is True:
        try:
            email = data.get('Email')
            username = data.get('Username')
            fullname = data.get('FullName')
            password = data.get('Password')
            status = data.get('Status')
            role = data.get('Role')
            phone = data.get('Phone')
            avatar = data.get('Avatar')

            try:
                user = User.objects.get(Email=email)
                return JsonResponse({
                    'status': 200,
                    'message': 'Login successful',
                    'data': {
                        'id': user.UserID,
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
                        'id': new_user.UserID,
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
        
        user = User.objects.filter(Username=username, Password=password).first()
        if user is not None:
            user.Status = True
            user.save()
            return JsonResponse({
                'status': 200,
                'message': 'Login successful',
                'data': {
                    'id': user.UserID,
                    'avatar': user.Avatar,
                    'role': user.Role,
                    'username': user.Username,
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
                'id': user.UserID,
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
                'id': user.UserID,
                'username': user.Username,
                'avatar': user.Avatar,
                'role': user.Role
            }
        })
        
@csrf_exempt
def get_user_data(request, id):
    try:
        user = User.objects.get(UserID=id)
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
    users = User.objects.all().values('UserID', 'FullName', 'Phone', 'Role', 'Status', 'Avatar')

    return JsonResponse({
        'status': 200,
        'message': 'All users retrieved successfully',
        'data': list(users),
    })
    
@csrf_exempt
def update_user(request, id):
    try:
        data = json.loads(request.body)
        current_user = User.objects.get(UserID=id)
        if 'Phone' in data:
            current_user.Phone = data['Phone']
        if 'Role' in data:
            current_user.Role = data['Role']
            
        current_user.save()
        
        return JsonResponse({
            'status': 200,
            'message': 'User updated successfully',
            'data': {
                'id': current_user.UserID,
                'username': current_user.Username,
                'email': current_user.Email,
                'phone': current_user.Phone,
                'role': current_user.Role
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 500,
            'message': str(e),
        })

@csrf_exempt
def delete_user(request, id):
    try:
        deleted_user = User.objects.get(UserID=id)
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
        