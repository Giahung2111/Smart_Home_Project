# ai_inference/models.py
from django.db import models

# Create your models here.
class AuthorizedUser(models.Model):
    name = models.CharField(max_length=50)
    faceimage = models.ImageField(upload_to='authorizedusers/')
    userid = models.ForeignKey("users.User", on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Authorized User: {self.name}"