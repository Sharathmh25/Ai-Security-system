from django.conf.urls import static
from django.urls import path
from .views import alerts_api
from . import views

urlpatterns = [
    path('home/',views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.logout, name='logout'),
    path('create-alert/', views.create_alert, name='create_alert'),
    path("upload/", views.upload_alert, name="upload_alert"),
    path('send_alerts_email/', views.send_alerts_email, name='send_alerts_email'),
    path('api/alerts/', alerts_api, name='alerts_api'),
]
