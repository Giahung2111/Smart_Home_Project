from django.db import models

# Create your models here.
class History(models.Model):
    status = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    device_id = models.ForeignKey("devices.Device", on_delete=models.CASCADE)
    userid = models.ForeignKey("users.User", on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.device_id} - {self.status} at {self.timestamp}"