from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from django.conf import settings

from .models import Alert
import base64
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect
from .models import Alert # Replace with your actual alert model name

def mark_safe(request, id):
    alert = get_object_or_404(Alert, id=id)
    alert.status = "Safe"
    alert.save()
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.method == 'POST':
        return JsonResponse({'status': 'success', 'message': f'Alert {id} marked safe.'})
        
    return redirect('dashboard')

def alerts_api(request):
    alerts = Alert.objects.all().order_by('-timestamp')

    data = []
    for a in alerts:
        data.append({
            "id": a.id,
            "status": a.status,
            "image": a.image.url if a.image else None,
            "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return JsonResponse({"alerts": data})


def send_alert_email(alert):
    if not alert.image:
        print("No image attached")
        return

    try:
        print("Sending email...")

        email = EmailMessage(
            subject="🚨 SECURITY ALERT - Intruder Detected",
            body=f"Intruder detected!\nStatus: {alert.status}",
            from_email=settings.EMAIL_HOST_USER,
            to=["sharathmh25@gmail.com"],
        )

        email.attach_file(alert.image.path)
        email.send(fail_silently=False)

        print("EMAIL SENT SUCCESS")

    except Exception as e:
        print("EMAIL FAILED:", e)

def home(request):
    return render(request, 'home.html')



def register(request):
    if request.method == 'POST':
        name = request.POST.get('username')   # FIX
        gmail = request.POST.get('email')     # FIX
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if not name or not password:
            messages.error(request, "All fields are required")
            return redirect('register')

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('register')

        if User.objects.filter(username=name).exists():
            messages.error(request, 'Username already exists')
            return redirect('register')

        User.objects.create_user(
            username=name,
            email=gmail,
            password=password
        )

        messages.success(request, 'User created successfully')
        return redirect('login')

    return render(request, 'register.html')

# =========================
# LOGIN
# =========================
def login(request):
    if request.method == 'POST':
        name = request.POST.get('username')   # FIX
        password = request.POST.get('password')

        if not name or not password:
            messages.error(request, "All fields are required")
            return redirect('login')

        user = authenticate(username=name, password=password)

        if user is not None:
            auth_login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid credentials")
            return redirect('login')

    return render(request, 'login.html')


def logout(request):
    auth_logout(request)
    return redirect('login')


def dashboard(request):
    alerts = Alert.objects.all().order_by('-timestamp')
    return render(request, 'dashboard.html', {'alerts': alerts})



def alertsystem(request):
    return render(request, 'alertsystem.html')



@csrf_exempt
def upload_alert(request):
    if request.method == "POST":
        image_data = request.POST.get("image")

        if not image_data:
            return JsonResponse({"error": "No image received"}, status=400)

        try:
            _, imgstr = image_data.split(';base64,')
            img = ContentFile(
                base64.b64decode(imgstr),
                name="alert.jpg"
            )

            alert = Alert.objects.create(
                status="INTRUDER DETECTED",
                image=img
            )

            send_alert_email(alert)

            return JsonResponse({"status": "success", "id": alert.id})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)



@csrf_exempt
def create_alert(request):
    if request.method == "POST":
        image = request.FILES.get("image")
        status = request.POST.get("status", "Intruder detected")

        alert = Alert.objects.create(
            image=image,
            status=status
        )

        send_alert_email(alert)

        return JsonResponse({"message": "Alert created", "id": alert.id})

    return JsonResponse({"error": "Invalid request"}, status=400)


def report_alert(request, id):
    alert = get_object_or_404(Alert, id=id)
    alert.status = "REPORTED"
    alert.save()
    return redirect('dashboard')



def mark_safe(request, id):
    alert = get_object_or_404(Alert, id=id)
    alert.status = "SAFE"
    alert.save()
    return redirect('dashboard')