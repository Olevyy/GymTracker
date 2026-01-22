from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    # Make email field unique
    email = models.EmailField(unique=True)
    Gender_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(max_length=1, choices=Gender_CHOICES, null=True, blank=True)
    body_weight = models.FloatField(null=True, blank=True)

    # Define a string representation for the user  
    def __str__(self):
        return self.username
    