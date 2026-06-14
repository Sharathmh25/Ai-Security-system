# 🔐 AI Security System (Django + OpenCV)

A real-time intruder detection system built using **Django, OpenCV, and IoT sensors**.
Captures images from camera, sends alerts, and notifies via email.

---

## 🚀 Features

* 📸 Capture image using webcam (OpenCV)
* 🚨 Intruder detection system
* 📧 Email alert with image attachment
* 📊 Dashboard to monitor alerts
* 🔐 User authentication (Login/Register)
* 🖥️ Clean UI with real-time updates

---

## 🛠️ Tech Stack

* Backend: Django (Python)
* Frontend: HTML, CSS, JavaScript
* Database: MySQL (Local) / PostgreSQL (Production)
* Computer Vision: OpenCV
* Email Service: Gmail SMTP

---

## 📂 Project Structure

```
Main/
 ├── sensor/        # Core app
 ├── templates/     # HTML pages
 ├── static/        # CSS & JS
 ├── media/         # Captured images
 ├── manage.py
```

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/your-username/ai-security-system.git
cd ai-security-system

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

---

## 🔑 Environment Variables

Create a `.env` file:

```
SECRET_KEY=your_secret_key
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
EMAIL_RECEIVER=your_email@gmail.com
```

---

## 📸 Screenshots

(Add dashboard images here later)

---

## 👨‍💻 Author

* Sharath MH
* First Year Engineering Student

---

## ⭐ Future Improvements

* Live camera streaming
* AI-based face recognition
* Mobile app integration
* Cloud deployment (AWS/GCP)

---
