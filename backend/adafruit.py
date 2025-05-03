import random
import os
import time
from utils.adafruit_io_operations import *
from Adafruit_IO import MQTTClient
from dotenv import load_dotenv

load_dotenv()

aio_feed_light_1 = os.environ.get('ADAFRUIT_AIO_FEED_LIGHT1')
aio_username = os.environ.get('ADAFRUIT_AIO_USERNAME')
aio_key = os.environ.get('ADAFRUIT_AIO_KEY')

client = MQTTClient(aio_username, aio_key)
client.on_connect = connected(client, aio_feed_light_1)
client.on_subscribe = subscribe
client.on_disconnect = disconnected
client.on_message = message
client.connect()
client.loop_background()

while True:
    # value = int(random.random() < 0.5)
    # print("Update:", value)
    # client.publish(aio_feed_light_1, value)
    # time.sleep(10)
    pass