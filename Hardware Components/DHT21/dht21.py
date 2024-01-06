import Adafruit_DHT

# Sensor type
sensor = Adafruit_DHT.AM2302 # Change this to match your sensor

# GPIO pin number
pin = 4

humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

while True
    if humidity is not None and temperature is not None:
        print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print('Failed to get reading. Try again!')