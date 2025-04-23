import os
import time
from Adafruit_IO import MQTTClient
from dotenv import load_dotenv

# Tải biến môi trường từ tệp .env
load_dotenv()

# Lấy biến môi trường
AIO_USERNAME = os.getenv("ADAFRUIT_AIO_USERNAME")
AIO_KEY = os.getenv("ADAFRUIT_AIO_KEY")
AIO_FEED_DOOR1_ID = os.getenv("ADAFRUIT_AIO_FEED_DOOR1")
AIO_FEED_LIGHT1_ID = os.getenv("ADAFRUIT_AIO_FEED_LIGHT1")
AIO_FEED_FAN1_ID = os.getenv("ADAFRUIT_AIO_FEED_FAN1")

# Danh sách các feed
AIO_FEED_LIST = [AIO_FEED_DOOR1_ID, AIO_FEED_LIGHT1_ID, AIO_FEED_FAN1_ID]

# Kiểm tra biến môi trường
if not all([AIO_USERNAME, AIO_KEY, *AIO_FEED_LIST]):
    raise ValueError("Lỗi: Thiếu biến môi trường. Vui lòng kiểm tra tệp .env.")

# Khởi tạo client MQTT
client = None

def init_mqtt_client():
    """Khởi tạo client MQTT."""
    global client
    if client is not None:
        return

    try:
        client = MQTTClient(AIO_USERNAME, AIO_KEY)
        client.on_connect = connected
        client.on_disconnect = disconnected
        client.on_message = message
        client.on_subscribe = subscribe
        client.connect()
        client.loop_background()
        print("MQTT client khởi tạo thành công")
    except Exception as e:
        print(f"Lỗi khởi tạo MQTT client: {e}")
        raise

def connected(client):
    print("Kết nối thành công...")
    for topic in AIO_FEED_LIST:
        client.subscribe(topic)
        print(f"Subscribed to {topic}")

def subscribe(client, userdata, mid, granted_qos):
    print("Subscribe thành công...")

def disconnected(client):
    print("Ngắt kết nối...")

def message(client, feed_id, payload):
    print(f"Nhận dữ liệu từ {feed_id}: {payload}")

def publish_data(feed_id, data):
    """Publish dữ liệu đến feed."""
    global client
    if client is None:
        print("Lỗi: MQTT client chưa được khởi tạo")
        return False
    try:
        client.publish(feed_id, data)
        print(f"✅ Published {data} to {feed_id}")
        time.sleep(2)  # Độ trễ để tránh vượt giới hạn Adafruit IO
        return True
    except Exception as e:
        print(f"⚠️ Lỗi khi publish tới {feed_id}: {e}")
        return False

# Khởi tạo client ngay khi module được import
init_mqtt_client()