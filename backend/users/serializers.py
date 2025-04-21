from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Liệt kê các trường cần hiển thị khi serialize đối tượng user
        fields = '__all__'
