from rest_framework import serializers
from .models import InferenceModel

class InferenceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = InferenceModel
        fields = '__all__'