from rest_framework import serializers
from .models import AuthorizedUser

class CameraActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["on", "off"])

class MicrophoneActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["on", "off"])

class AuthorizedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorizedUser
        fields = ['name', 'faceimage']