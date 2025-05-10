# ai_inference/urls.py
from django.urls import path
from .views import CameraControl, MicrophoneControl, FaceRecognitionAllowed

urlpatterns = [
    path('camera/', CameraControl.as_view(), name='camera-control'),
    path('microphone/', MicrophoneControl.as_view(), name='microphone-control'),
    path('face_recognition_allowed/', FaceRecognitionAllowed.as_view(), name='face-recognition-allowed'),
]