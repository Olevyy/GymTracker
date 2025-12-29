from rest_framework import viewsets, permissions, exceptions
from .models import Workout, WorkoutSet, WorkoutExercise
from .serializers import WorkoutSerializer, WorkoutSetSerializer, WorkoutExerciseSerializer

# Auto-generated CRUD endpoints for Workout
class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)\
            .prefetch_related('exercises__sets', 'exercises__exercise')\
            .order_by('-start_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Single exercise within a workout
class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    # Wyłączamy 'list', bo listę pobierasz przez WorkoutViewSet
    http_method_names = ['get', 'post', 'patch', 'delete'] 

    def get_queryset(self):
        # Zabezpieczenie: user ma dostęp tylko do swoich ćwiczeń treningowych
        return WorkoutExercise.objects.filter(workout__user=self.request.user)


# NOWOŚĆ 2: Obsługa pojedynczych serii (np. poprawa ciężaru, usunięcie serii)
class WorkoutSetViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSetSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        # Zabezpieczenie: user ma dostęp tylko do swoich serii
        return WorkoutSet.objects.filter(workout_exercise__workout__user=self.request.user)