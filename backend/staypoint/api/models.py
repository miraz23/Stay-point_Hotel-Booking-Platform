from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Hotel(models.Model):
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    rating = models.FloatField()
    image=models.ImageField(null=True,blank=True)
    
    def __str__(self):
        return self.name