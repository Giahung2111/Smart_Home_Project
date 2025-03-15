from django.db import models

# Create your models here.
class Device(models.Model):
    devicename = models.CharField(max_length=50)
    devicetype = models.CharField(max_length=50)
    createdat = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    status = models.BooleanField(default=True)
    roomid = models.ForeignKey("rooms.Room", on_delete=models.CASCADE)

    def __str__(self):
        return self.devicename