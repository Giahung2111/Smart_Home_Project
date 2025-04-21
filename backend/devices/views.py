from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Device
from .models import Temperature
from .serializers import DeviceSerializer

class DeviceList(APIView):
    def get(self, request):
        devices = Device.objects.all()
        serializer = DeviceSerializer(devices, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()  # Sao chép dữ liệu để chỉnh sửa

        # Kiểm tra loại thiết bị
        devicetype = data.get("devicetype", "").lower()
        if devicetype in ["door", "fan"]:
            data["roomid"] = None  # Cửa và quạt không có roomid
        
        serializer = DeviceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeviceDetail(APIView):
    def get_object(self, pk):
        try:
            return Device.objects.get(pk=pk)
        except Device.DoesNotExist:
            return None

    def get(self, request, pk):
        device = self.get_object(pk)
        if device is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = DeviceSerializer(device)
        return Response(serializer.data)

    def patch(self, request, pk):
        device = self.get_object(pk)
        if device is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        # Kiểm tra loại thiết bị
        devicetype = data.get("devicetype", "").lower()
        if devicetype in ["door", "fan"]:
            data["roomid"] = None

        serializer = DeviceSerializer(device, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TemperatureList(APIView):
    def get(self, request):
        lastest_temperature = Temperature.objects.last()
        if lastest_temperature is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response({"temperature": lastest_temperature.temperature})
