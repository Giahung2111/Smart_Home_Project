import sys

def connected(client, feed_id):
    print("Connected to Adafruit IO!")
    client.subscribe(feed_id)

def subscribe(client, userdata, mid, granted_qos):
    print("Subscribed to feed with ID: {}".format(mid))

def disconnected(client):
    print("Disconnected from Adafruit IO!")
    sys.exit(1)

def message(client, feed_id, payload):
    print("Received message from feed {}: {}".format(feed_id, payload))

