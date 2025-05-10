from django.db import models
from users.models import User

# Create your models here.
class Device(models.Model):
    devicename = models.CharField(max_length=50)
    devicetype = models.CharField(max_length=50)
    createdat = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    status = models.BooleanField(default=True)
    user_id = models.ManyToManyField(User, through='ControlRelationship')


class ControlRelationship(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    device_status = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'devices_controlrelationship'
    