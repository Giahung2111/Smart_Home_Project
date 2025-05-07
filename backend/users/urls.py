from django.urls import path
from . import views

urlpatterns = [
    path('users/login', views.login, name='login'), # OK
    path('users/register', views.register, name='register'), # OK
    path('users/<int:id>', views.get_user_data, name='personal-information'), # OK
    path('users', views.get_all_users, name='users'),   # OK
    path('users/update/<int:id>', views.update_user, name='update_user'), # OK
    path('users/delete/<int:id>', views.delete_user, name='delete_user'), # OK
]