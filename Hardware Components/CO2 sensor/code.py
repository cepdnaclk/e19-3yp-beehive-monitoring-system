# import time
# import Adafruit_ADS1x15

# adc = Adafruit_ADS1x15.ADS1115()

# GAIN = 1

# print('Reading ADS1x15 values, press Ctrl-C to quit...')

# while True:
#     val = adc.read_adc(0, gain=GAIN)
#     print('Channel 0: {0}'.format(val))
#     time.sleep(0.5)


import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import numpy as np

# Calibration parameters (replace with your own calibration curve)
RZERO = 76.63  # Calibrated sensor resistance at fresh air (in kOhms)
PARA = 116.6020682
PARB = 2.769034857

# Initialize ADS1115
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
chan = AnalogIn(ads, ADS.P0)

def get_co2_ppm():
    voltage = chan.value  # Read sensor voltage
    rs = (5.0 * RZERO) / (voltage - 5.0)  # Calculate sensor resistance
    ratio = rs / RZERO  # Calculate resistance ratio
    ppm = PARA * np.power(ratio, -PARB)  # Apply calibration curve
    return ppm

while True:
    co2_ppm = get_co2_ppm()
    print("CO2:", co2_ppm, "ppm")
    time.sleep(1)  # Adjust reading interval as needed
