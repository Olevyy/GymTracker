from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    # Make email field unique
    email = models.EmailField(unique=True)

    # Define a string representation for the user  
    def __str__(self):
        return self.username
    