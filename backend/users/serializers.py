from rest_framework import serializers
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer

# Serializer for the User model
class CustomRegisterSerializer(RegisterSerializer):
    
    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return email



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'gender', 'body_weight']

        read_only_fields = ['id', 'email', 'username']