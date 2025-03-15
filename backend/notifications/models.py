from django.db import models

class Notification(models.Model):
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)
    user_id = models.ForeignKey("users.User", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.device_name} - {self.action} by {self.user_name} at {self.timestamp}"