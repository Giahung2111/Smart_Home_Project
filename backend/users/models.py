from django.db import models

# Create your models here.
class User(models.Model):
    UserID = models.AutoField(primary_key=True)
    Username = models.CharField(max_length=50)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    Password = models.CharField(max_length=50)
    FullName = models.CharField(max_length=50)
    Email = models.EmailField(unique=True)
    Status = models.BooleanField(default=True)
    Phone = models.CharField(max_length=50, blank=True, null=True)
    Role = models.CharField(max_length=50)
    Avatar = models.CharField(max_length=200, default='https://example.com/default-avatar.png')
    GoogleCredential = models.BooleanField(default=False)
    

    def __str__(self):
        return self.Username