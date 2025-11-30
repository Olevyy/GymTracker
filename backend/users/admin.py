from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Fields to display in the user list in admin
    list_display = ['email', 'username', 'is_active']
    
    # Fields to search by in admin
    search_fields = ['email', 'username']
