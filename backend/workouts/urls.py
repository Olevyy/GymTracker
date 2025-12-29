from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet, WorkoutExerciseViewSet, WorkoutSetViewSet

router = DefaultRouter()
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'workout-exercises', WorkoutExerciseViewSet, basename='workout-exercise')
router.register(r'workout-sets', WorkoutSetViewSet, basename='workout-set')

urlpatterns = [
    path('', include(router.urls)),
]