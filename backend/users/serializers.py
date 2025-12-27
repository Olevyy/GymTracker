from rest_framework import serializers
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer

# Serializer for the User model
class UserSerializer(RegisterSerializer):
    
    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return email
    
    class Meta:
        model = User 
        # Specify the fields to be included in the serialization
        fields = ['id', 'username', 'email']

