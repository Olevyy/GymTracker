from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    # Includes endpoints:
    #POST /api/auth/login/                 - Login (JWT access + refresh)
    #POST /api/auth/logout/                - Logout
    #POST /api/auth/password/change/       - Change password
    #POST /api/auth/password/reset/        - Request password reset email
    #POST /api/auth/password/reset/confirm/ - Confirm password reset
    #GET  /api/auth/user/                  - Get user profile (authenticated)
    #PUT  /api/auth/user/                  - Update full user profile
    #PATCH /api/auth/user/                 - Update partial user profile
    #POST /api/auth/token/refresh/         - Refresh JWT token
    path('api/auth/', include('dj_rest_auth.urls')),

    # Includes endpoints:
    #POST /api/auth/registration/               - Register new user
    #POST /api/auth/registration/verify-email/  - Verify email using code
    #POST /api/auth/registration/resend-email/  - Resend confirmation email """
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Includes endpoints:
    #GET /api/account/confirm-email/<key>/   - Confirms email from email link
    path('api/account/', include('allauth.urls')),
    ]