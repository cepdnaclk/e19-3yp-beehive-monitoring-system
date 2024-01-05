import RPi.GPIO as GPIO
import time
import sys
from hx711 import HX711

GPIO.setmode(GPIO.BCM)

hx = HX711(dout_pin=5, pd_sck_pin=6)

while True:
    reading = hx.get_raw_data_mean()
    if reading:
        print("Weight: {}".format(reading))
    else:
        print("invalid data")
    hx.power_down()
    hx.power_up()
    time.sleep(0.1)
    

