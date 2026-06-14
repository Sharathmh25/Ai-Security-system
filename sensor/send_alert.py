import cv2
import requests
import time

URL = "http://127.0.0.1:8000/create-alert/"

cap = cv2.VideoCapture(0)
time.sleep(2)

ret, frame = cap.read()

print("Camera working:", ret)

if ret:
    image_path = "capture.jpg"
    cv2.imwrite(image_path, frame)
    print("Image saved")

    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'status': 'Intruder detected'}

        response = requests.post(URL, files=files, data=data)

    print("Server response:", response.text)

else:
    print("❌ Camera not working")

cap.release()
cv2.destroyAllWindows()