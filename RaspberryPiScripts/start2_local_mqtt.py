"""
Local-network version of start2_with_real_values.py.

Sensor code is unchanged. The only difference is where readings go: instead of
AWS IoT Core over mutual TLS, this publishes to a Mosquitto broker on the laptop.

Install on the Pi:  pip install paho-mqtt
"""

import time
import json
import os

import paho.mqtt.client as mqtt

# Imports for CO2 level
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import numpy as np

# Imports for DHT21
import Adafruit_DHT

# Imports for Weight Measurements
import RPi.GPIO as GPIO
from hx711 import HX711

# ------------------------------------------------------------------------
# Code for CO2 level
clean_air_value = 6000
co2_conc = 440

air_value = 14000
co2_val = 200

# Initialize ADS1115
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
chan = AnalogIn(ads, ADS.P0)

def get_co2_ppm():
    voltage = chan.value  # Read sensor voltage
    ppm = (voltage-7000)*-1*220/7000+440
    return ppm


# ------------------------------------------------------------------------
# Code for DHT21
# Sensor type
sensor = Adafruit_DHT.AM2302  # Change this to match your sensor

# GPIO pin number
DHTpin = 23


# Code for Weight
GPIO.setmode(GPIO.BCM)

hx1 = HX711(dout_pin=6, pd_sck_pin=5)
hx1.zero

hx2 = HX711(dout_pin=13, pd_sck_pin=12)
hx2.zero

hx3 =  HX711(dout_pin=21, pd_sck_pin=20)
hx3.zero

def get_weight():
    reading1 = hx1.get_raw_data_mean()+18860
    reading2 = hx2.get_raw_data_mean()+18000
    reading3 = hx3.get_raw_data_mean()-52320

    weight1 = 0.664 * (-1*reading1) / 16250
    weight2 = 0.664 * (reading2) / 28000
    weight3 = 0.664 * (-1*reading3) / 23000

    weight = (weight1+weight2+weight3)/3
    return weight


# ------------------------------------------------------------------------
# There is no battery sensor on the rig, and the AWS version published a fixed
# 76 so the low-battery path could never fire. Draining a simulated value lets
# the notification actually appear during the demo. Set DRAIN to 0 to hold
# BATTERY_START steady instead.
BATTERY_START = 100.0
BATTERY_DRAIN_PER_READING = 0.5

battery_level = BATTERY_START

def get_battery_level():
    global battery_level
    battery_level = max(0.0, battery_level - BATTERY_DRAIN_PER_READING)
    return round(battery_level, 1)


# ------------------------------------------------------------------------
# Broker parameters. Point BROKER_HOST at the laptop's IP on the hotspot.
BROKER_HOST = os.environ.get("BROKER_HOST", "192.168.43.1")
BROKER_PORT = int(os.environ.get("BROKER_PORT", 1883))
topic = "beehive/metrics"
clientId = "python-beehive"

with open('credentials_and_beehive_id.txt', 'r') as file:
    lines = file.readlines()
    beehive_id = lines[2].strip().split(": ")[1]

# paho-mqtt 2.x requires the callback API version; 1.x does not accept it.
# Pi images ship either, so pick whichever the installed version supports.
try:
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=clientId)
except AttributeError:
    client = mqtt.Client(client_id=clientId)

client.connect(BROKER_HOST, BROKER_PORT, keepalive=60)
client.loop_start()
print('Connected to broker at %s:%d' % (BROKER_HOST, BROKER_PORT))

last_humidity = None
last_temperature = None

# Publish to the topic in a loop
while True:
    # Read before building the message. The AWS version read after, so every
    # payload carried the previous cycle's temperature and humidity.
    humidity, temperature = Adafruit_DHT.read_retry(sensor, DHTpin)

    # read_retry gives up and returns None fairly often on the AM2302. Publishing
    # that null propagates all the way to the dashboard, so hold the last good
    # reading instead and only skip while we have nothing at all.
    if humidity is None or temperature is None:
        if last_humidity is None or last_temperature is None:
            print('No valid DHT reading yet, skipping this cycle')
            time.sleep(1)
            continue
        humidity, temperature = last_humidity, last_temperature
        print('DHT read failed, reusing last good values')
    else:
        last_humidity, last_temperature = humidity, temperature

    message = {
        'beehive_id': beehive_id,
        'Temperature': temperature,
        'Humidity': humidity,
        'Weight': get_weight(),
        'CO2': get_co2_ppm(),
        'Battery_level': get_battery_level(),
        'timestamp': int(time.time())
    }
    messageJson = json.dumps(message)
    client.publish(topic, messageJson, qos=1)
    print('Published topic %s: %s\n' % (topic, messageJson))
    time.sleep(1)
