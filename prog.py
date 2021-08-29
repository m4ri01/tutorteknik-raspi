import RPi.GPIO as GPIO
import time
import paho.mqtt.client as client
import paho.mqtt.publish as publish
import Adafruit_DHT
import threading



GPIO.setmode(GPIO.BCM)
relay = 17
GPIO.setup(relay,GPIO.OUT)

GPIO.output(relay,GPIO.LOW)

def main():
    DHT_SENSOR = Adafruit_DHT.DHT11
    DHT_PIN = 4
    while True:
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
        print("Suhu = {}, kelembaban = {}".format(temperature,humidity))
        publish.single("/tutorteknik/kelembaban",str(humidity),hostname="116.193.190.68")
        publish.single("/tutorteknik/suhu",str(temperature),hostname="116.193.190.68")




def bacarelay(mosq,obj,msg):
    data = str(msg.payload,'utf-8')
    if(data == "0"):
        GPIO.output(relay,False)
    else:
        GPIO.output(relay,True)



def mq():
    try:
        mqttc = client.Client("clientnode")
        mqttc.message_callback_add("/tutorteknik/relay", bacarelay)
        mqttc.connect("116.193.190.68", 1883, 60)
        mqttc.subscribe("/tutorteknik/#", 0)
        mqttc.loop_start()
    except:
        mqttc.loop_stop()

if __name__ == "__main__":
    MQ = threading.Thread(target=mq,args=())
    MQ.start()
    main()