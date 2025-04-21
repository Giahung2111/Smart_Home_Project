from django.db import models

class Device(models.Model):
    DEVICE_TYPES = [
        ("light", "Light"),
        ("fan", "Fan"),
        ("door", "Door"),
    ]

    devicename = models.CharField(max_length=50)
    devicetype = models.CharField(max_length=10, choices=DEVICE_TYPES)  # Giới hạn loại thiết bị
    createdat = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    status = models.BooleanField(default=True)
    roomid = models.ForeignKey(
        "rooms.Room",  
        on_delete=models.CASCADE, 
        null=True,  
        blank=True  
    )

    def __str__(self):
        return self.devicename

class Temperature(models.Model):
    temperature = models.FloatField()
    createdat = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.temperature)