from django.urls import path
from . import views

urlpatterns = [
    path('<int:device_id>/', views.get_device_by_id, name='get_device_by_id'),
    path('update/<int:device_id>/', views.update_device, name='update_device'),
]