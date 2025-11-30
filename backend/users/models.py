from django.db import models
from django.contrib.auth.models import AbstractUser



# Create your models here.
class User(AbstractUser):
    # Make email the unique identifier for authentication
    email = models.EmailField(unique=True)

    # Set email as the USERNAME_FIELD and require username
    REQUIRED_FIELDS = ['email']

    # Define a string representation for the user  
    def __str__(self):
        return self.email
    