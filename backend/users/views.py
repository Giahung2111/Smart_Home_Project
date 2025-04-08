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

            # Try to find existing user
            try:
                user = User.objects.get(Email=email)
                return JsonResponse({
                    'status': 200,
                    'message': 'Login successful',
                    'data': {
                        'username': user.Username,
                        'email': user.Email,
                        'role': user.Role
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
                    Phone=phone
                )
                return JsonResponse({
                    'status': 201,
                    'message': 'User created successfully',
                    'data': {
                        'username': new_user.Username,
                        'email': new_user.Email,
                        'role': new_user.Role
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
        
        user = User.objects.filter(Username=username, Password=password).first()
        print("User: ", user)
        if user is not None:
            user.Status = status
            user.save()
            return JsonResponse({
                'status': 200,
                'message': 'Login successful',
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
    
    if credential == True:
        user = User.objects.create(
            Username=username,
            Email=email,
            Password=password,
            Status=status,
            FullName=fullname,
            Role=role,
            Phone=phone,
            GoogleCredential=credential
        )
        
        return JsonResponse({
            'status': 201,
            'message': 'User created successfully'
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
            GoogleCredential=credential
        )
        
        return JsonResponse({
            'status': 201,
            'message': 'User created successfully'
        })