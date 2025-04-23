# devices/views.py
from django.urls import path
from .views import DeviceList, DeviceDetail
from .views import TemperatureList

urlpatterns = [
    path('', DeviceList.as_view(), name='device-list'),
    path('<int:pk>/', DeviceDetail.as_view(), name='device-detail'),
    path('temperature/', TemperatureList.as_view(), name='temperature-list'),
]