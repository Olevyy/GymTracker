from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutTemplateViewSet

router = DefaultRouter()
router.register(r'templates', WorkoutTemplateViewSet, basename='templates')

urlpatterns = [
    path('', include(router.urls)),
]