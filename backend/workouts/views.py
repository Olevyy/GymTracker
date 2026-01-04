from rest_framework import viewsets, permissions, exceptions
from .models import Workout, WorkoutSet, WorkoutExercise
from .serializers import WorkoutSerializer, WorkoutSetSerializer, WorkoutExerciseSerializer
from django_filters import rest_framework as filters
from .services import get_weekly_stats
from rest_framework.decorators import action
from rest_framework.response import Response

class WorkoutFilter(filters.FilterSet):
    # date = filters.DateFilter(field_name='start_time', lookup_expr='date')
    # Data range filters
    from_date = filters.DateFilter(field_name='start_time', lookup_expr='date__gte')
    to_date = filters.DateFilter(field_name='start_time', lookup_expr='date__lte')

    class Meta:
        model = Workout
        fields = []

# Auto-generated CRUD endpoints for Workout
class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = WorkoutFilter

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)\
            .prefetch_related('exercises__sets', 'exercises__exercise')\
            .order_by('-start_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Get monthly stats for user
    @action(detail=False, methods=['get'], url_path='weekly-stats')
    def weekly_stats(self, request):
        data = get_weekly_stats(request.user)
        return Response(data)


# Single exercise within a workout
class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    # Removes PUT method from allowed methods
    http_method_names = ['get', 'post', 'patch', 'delete'] 

    def get_queryset(self):
        # User has access only to their workout exercises
        return WorkoutExercise.objects.filter(workout__user=self.request.user)


# Single set within an exercise
class WorkoutSetViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSetSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        # User has access only to their workout sets
        return WorkoutSet.objects.filter(workout_exercise__workout__user=self.request.user)