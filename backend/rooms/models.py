from django.db import models

# Create your models here.
class Room(models.Model):
    roomname = models.CharField(max_length=50)
    createdat = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

    def __str__(self):
        return self.roomname