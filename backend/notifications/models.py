from django.db import models

class Notification(models.Model):
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)
    user_id = models.ForeignKey("users.User", on_delete=models.CASCADE)
    device_id = models.IntegerField(null=True, blank=True)
    device_name = models.CharField(max_length=255, null=True, blank=True)
    action = models.CharField(max_length=10, choices=[('on', 'On'), ('off', 'Off'), ('open', 'Open'), ('close', 'Close')], null=True, blank=True)
    user_name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.device_name} - {self.action} by {self.user_name} at {self.timestamp}"