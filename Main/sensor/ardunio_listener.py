import serial
import cv2
import requests
import time

# change COM port (check in Device Manager)
arduino = serial.Serial('COM5', 9600)
time.sleep(2)

URL = "http://127.0.0.1:8000/api/create-alert/"

cap = cv2.VideoCapture(0)

while True:
    data = arduino.readline().decode().strip()
    print("Arduino:", data)

    if "MOTION" in data or "INTRUDER" in data:
        ret, frame = cap.read()

        if ret:
            image_path = "alert.jpg"
            cv2.imwrite(image_path, frame)

            files = {'image': open(image_path, 'rb')}
            payload = {'status': 'Intruder detected'}

            requests.post(URL, files=files, data=payload)

            print("Alert sent to Django!")

        time.sleep(5)