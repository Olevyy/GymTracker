from django.urls import path
from .views import ExerciseViewSet

urlpatterns = [
    path('', ExerciseViewSet.as_view({'get': 'list'}), name='exercise-list'),
    # Detail view for a single exercise
    path('<int:pk>/', ExerciseViewSet.as_view({'get': 'retrieve'}), name='exercise-detail'),
]