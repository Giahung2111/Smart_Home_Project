from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_rooms, name='rooms'),
    path('<str:room_name>', views.get_room_by_name, name='get_room_by_name'),
]