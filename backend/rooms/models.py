from django.db import models
from devices.models import Device


class Room(models.Model):
    RoomName = models.CharField(max_length=50)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    Description = models.TextField()
    device_id = models.ForeignKey(Device, on_delete=models.SET_DEFAULT, default=0)