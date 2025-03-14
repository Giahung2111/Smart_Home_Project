from django.db import models

# Create your models here.
class User(models.Model):
    Username = models.CharField(max_length=50)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    Password = models.CharField(max_length=50)
    FullName = models.CharField(max_length=50)
    Email = models.EmailField(unique=True)
    Status = models.BooleanField(default=True)
    Phone = models.CharField(max_length=50)
    Role = models.CharField(max_length=50)

    def __str__(self):
        return self.Username