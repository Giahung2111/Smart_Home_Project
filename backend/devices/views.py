from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Device
from .models import Temperature
from .serializers import DeviceSerializer
from mqtt_client import publish_data
from dotenv import load_dotenv
import os

# Tải biến môi trường từ tệp .env
load_dotenv()

AIO_FEED_DOOR1_ID = os.getenv("ADAFRUIT_AIO_FEED_DOOR1")
AIO_FEED_LIGHT1_ID = os.getenv("ADAFRUIT_AIO_FEED_LIGHT1")
AIO_FEED_FAN1_ID = os.getenv("ADAFRUIT_AIO_FEED_FAN1")

class DeviceList(APIView):
    def get(self, request):
        devices = Device.objects.all()
        serializer = DeviceSerializer(devices, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()  # Sao chép dữ liệu để chỉnh sửa
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
        # Sử dụng devicetype từ dữ liệu gửi lên hoặc từ thiết bị hiện tại
        devicetype = data.get("devicetype", device.devicetype).lower()
        if devicetype in ["door", "fan"]:
            data["roomid"] = None

        data_status = data.get("status")
        success = None  # Khởi tạo success với giá trị mặc định

        if data_status is not None:
            if devicetype == "door":
                success = publish_data(AIO_FEED_DOOR1_ID, "1" if data_status else "0")
            elif devicetype == "light":
                success = publish_data(AIO_FEED_LIGHT1_ID, "1" if data_status else "0")
            elif devicetype == "fan":
                success = publish_data(AIO_FEED_FAN1_ID, "1" if data_status else "0")
            else:
                return Response(
                    {"error": f"Loại thiết bị không hợp lệ: {devicetype}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if success is not None and not success:
                return Response(
                    {"error": "Không thể gửi lệnh đến thiết bị qua MQTT"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

        serializer = DeviceSerializer(device, data=data, partial=True)
        if serializer.is_valid():
            # Chỉ lưu nếu không cần gửi MQTT (success is None) hoặc gửi MQTT thành công
            if success is None or success:
                serializer.save()
                return Response(serializer.data)
            return Response(
                {"error": "Không thể gửi lệnh đến thiết bị qua MQTT"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TemperatureList(APIView):
    def get(self, request):
        lastest_temperature = Temperature.objects.last()
        if lastest_temperature is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response({"temperature": lastest_temperature.temperature})