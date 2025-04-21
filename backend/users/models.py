from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50)
    createdat = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=50)
    fullname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    status = models.BooleanField(default=True)
    phone = models.CharField(max_length=50)
    role = models.CharField(max_length=50)

    def __str__(self):
        return self.Username