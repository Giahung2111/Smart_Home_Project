from django.urls import path
from . import views

urlpatterns = [
    path('users/login', views.login, name='login'),
    path('users/register', views.register, name='register'),
    path('users/<int:id>', views.get_user_data, name='personal-information'),
    path('users/', views.get_all_users, name='users'),
    path('users/update/<int:id>', views.update_user, name='update_user'),
    path('users/delete/<int:id>', views.delete_user, name='delete_user'),
]