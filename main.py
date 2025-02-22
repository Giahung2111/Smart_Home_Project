import sys
from Adafruit_IO import MQTTClient
import random
import time

AIO_FEED_ID = "bbc-led"
AIO_USERNAME = "GiaHung2111"
AIO_KEY = "aio_mhju46aVjYw4rLoEm2Md9iih3SGO"

def connected ( client ) :
	print ("Ket noi thanh cong ...")
	client.subscribe( AIO_FEED_ID )

def subscribe ( client , userdata , mid , granted_qos ) :
	print("Subcribe thanh cong ...")

def disconnected ( client ) :
	print("Ngat ket noi ...")
	sys.exit (1)

def message ( client , feed_id , payload ):
	print("Nhan du lieu : " + payload )
	
client = MQTTClient ( AIO_USERNAME , AIO_KEY )
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect ()
client.loop_background ()


while True :
	pass