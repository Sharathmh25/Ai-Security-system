from django.db import models

# Create your models here.
class Alert(models.Model):
    image=models.ImageField(upload_to='alerts/')
    timestamp=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20,default='Pending')
def __str__(self):
    return f"Alert {self.id} - {self.status}"