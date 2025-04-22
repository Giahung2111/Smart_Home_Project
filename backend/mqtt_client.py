import sys
import os
from Adafruit_IO import MQTTClient
from dotenv import load_dotenv
import time

# Tải biến môi trường từ tệp .env
load_dotenv()

AIO_FEED_DOOR1_ID = os.getenv("ADAFRUIT_AIO_FEED_DOOR1")
AIO_FEED_LIGHT1_ID = os.getenv("ADAFRUIT_AIO_FEED_LIGHT1")
AIO_FEED_FAN1_ID = os.getenv("ADAFRUIT_AIO_FEED_FAN1")
AIO_USERNAME = os.getenv("ADAFRUIT_AIO_USERNAME")
AIO_KEY = os.getenv("ADAFRUIT_AIO_KEY")

AIO_FEED_LIST = [AIO_FEED_DOOR1_ID, AIO_FEED_LIGHT1_ID, AIO_FEED_FAN1_ID]

def connected(client):
    print("Ket noi thanh cong ...")
    for topic in AIO_FEED_LIST:
        client.subscribe(topic)

def subscribe(client , userdata , mid , granted_qos):
    print("Subscribe thanh cong ...")

def disconnected(client):
    print("Ngat ket noi ...")
    sys.exit (1)

def message(client , feed_id , payload):
    print("Nhan du lieu: " + payload + " feed id: " + feed_id)


client = MQTTClient(AIO_USERNAME , AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()

def publish_data(feed_id, data):
    """Publish dữ liệu đến feed."""
    try:
        client.publish(feed_id, data)
        time.sleep(2)  # Độ trễ để tránh vượt giới hạn Adafruit IO
        return True
    except Exception as e:
        print(f"Lỗi khi publish tới {feed_id}: {e}")
        return False

def open_door():
    """Mở cửa."""
    print("✅ Mở Cửa với feed ID:", AIO_FEED_DOOR1_ID)
    return publish_data(AIO_FEED_DOOR1_ID, "1")

def close_door():
    """Đóng cửa."""
    print("✅ Đóng Cửa với feed ID:", AIO_FEED_DOOR1_ID)
    return publish_data(AIO_FEED_DOOR1_ID, "0")

def turn_on_light():
    """Bật đèn."""
    print("✅ Bật Đèn với feed ID:", AIO_FEED_LIGHT1_ID)
    return publish_data(AIO_FEED_LIGHT1_ID, "1")

def turn_off_light():
    """Tắt đèn."""
    print("✅ Tắt Đèn với feed ID:", AIO_FEED_LIGHT1_ID)
    return publish_data(AIO_FEED_LIGHT1_ID, "0")

def turn_on_fan():
    """Bật quạt."""
    print("✅ Bật Quạt với feed ID:", AIO_FEED_FAN1_ID)
    return publish_data(AIO_FEED_FAN1_ID, "1")

def turn_off_fan():
    """Tắt quạt."""
    print("✅ Tắt Quạt với feed ID:", AIO_FEED_FAN1_ID)
    return publish_data(AIO_FEED_FAN1_ID, "0")

close_door()