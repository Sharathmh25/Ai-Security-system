import serial
import cv2
import time

PORT = "COM5"
BAUD = 9600

arduino = serial.Serial(PORT, BAUD, timeout=1)
time.sleep(2)

cap = cv2.VideoCapture(0)

print("🚀 LIVE SYSTEM STARTED")

while True:
    line = arduino.readline().decode('utf-8', errors='ignore').strip()

    if not line:
        continue

    print("Arduino:", line)

    if "PIR" in line and "DIST" in line:
        try:
            parts = line.split(",")

            pir = int(parts[0].split(":")[1])
            dist = int(parts[1].split(":")[1])

            # Show LIVE camera feed
            ret, frame = cap.read()

            if ret:
                cv2.imshow("LIVE CAMERA", frame)

            # Trigger capture
            if pir == 1:
                print("🚨 MOTION DETECTED")

                cv2.imwrite("live_alert.jpg", frame)
                print("📸 Image saved")

            # press q to exit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        except:
            pass

cap.release()
cv2.destroyAllWindows()