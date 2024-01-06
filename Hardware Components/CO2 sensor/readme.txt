pip3 install adafruit-circuitpython-ads1x15
pip install adafruit-circuitpython-busdevice



Here's a guide on how to connect the MQ135, ADS1115, and Raspberry Pi 3B:

1. Components:

Raspberry Pi 3B
MQ135 gas sensor
ADS1115 ADC converter
Breadboard
Jumper wires
Resistors (220 ohm, 10 kohm)
Power supply (5V)


2. Connections:

MQ135:
VCC to 5V (through a 220-ohm resistor)
GND to GND
AOUT to an analog input channel on ADS1115 (e.g., A0)
DOUT (optional, for digital output) to a GPIO pin on Raspberry Pi

ADS1115:
VCC to 5V
GND to GND
SCL to SCL pin on Raspberry Pi (GPIO 3)
SDA to SDA pin on Raspberry Pi (GPIO 2)

Raspberry Pi:
Connect 5V power supply to Raspberry Pi's 5V pin
Connect ground from power supply to Raspberry Pi's GND pin



3. I2C Configuration:

Enable I2C on Raspberry Pi:
Open Raspberry Pi Configuration tool
Go to Interfaces tab
Enable I2C