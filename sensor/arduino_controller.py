import serial
import cv2
import requests
import time

PORT = 'COM5'   # change if needed
BAUD = 9600
URL = "http://127.0.0.1:8000/api/create-alert/"

arduino = serial.Serial(PORT, BAUD, timeout=1)
time.sleep(2)

cap = cv2.VideoCapture(0)

last_trigger = 0
cooldown = 5

print("🚀 System Started")

while True:
    line = arduino.readline().decode('utf-8', errors='ignore').strip()

    if not line:
        continue

    print("Arduino:", line)

    try:
        if "PIR" in line and "DIST" in line:
            parts = line.split(",")

            pir = int(parts[0].split(":")[1])
            dist = int(parts[1].split(":")[1])

            current_time = time.time()

            # 🔥 SMART INTRUDER LOGIC
            if pir == 1 and dist > 0 and dist < 50:

                if current_time - last_trigger > cooldown:

                    print("🚨 INTRUDER DETECTED")

                    ret, frame = cap.read()

                    if ret:
                        cv2.imwrite("alert.jpg", frame)

                        files = {'image': open("alert.jpg", 'rb')}
                        data = {'status': 'Intruder detected'}

                        requests.post(URL, files=files, data=data)

                    last_trigger = current_time

    except:
        pass