from rest_framework import serializers
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer

# Serializer for the User model
class UserSerializer(RegisterSerializer):
    class Meta:
        model = User 
        # Specify the fields to be included in the serialization
        fields = ['id', 'username', 'email']

