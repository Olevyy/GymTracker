import django_filters
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F, ExpressionWrapper, FloatField
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Exercise
from .serializers import ExerciseSerializer
from workouts.serializers import WorkoutSetSerializer

# Pagination 20 items per page
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# Filter class needed for muscle filtering
class ExerciseFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    equipment = django_filters.CharFilter(lookup_expr='icontains')
    
    # Custom filter for primary muscle
    muscle = django_filters.CharFilter(method='filter_by_muscle')

    class Meta:
        model = Exercise
        fields = ['level', 'category', 'mechanic', 'force'] # exact matches

    def filter_by_muscle(self, queryset, name, value):
        return queryset.filter(primary_muscles__contains=[value]) # Filter primary_muscles array field

# Auto-generated CRUD endpoints for Exercise
class ExerciseViewSet(viewsets.ReadOnlyModelViewSet): # ReadOnly
    queryset = Exercise.objects.all().order_by('name')
    pagination_class = StandardResultsSetPagination
    
    filter_backends = [
        DjangoFilterBackend,   # ?level=beginner&category=strength
        filters.SearchFilter,  # ?search=...
    ] 

    filterset_class = ExerciseFilter
    search_fields = ['name']
    # If asked for list view, different serializer
    def get_serializer_class(self):
        if self.action == 'list':
            from .serializers import ExerciseListSerializer
            return ExerciseListSerializer
        return ExerciseSerializer

        
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def history(self, request, pk=None):
        """
        Retrieves last 10 workouts with this exercise for the user
        URL: /api/exercises/{id}/history/
        """
        from workouts.models import WorkoutExercise
        
        exercise = self.get_object()

        history_items = WorkoutExercise.objects.filter(
            exercise=exercise, 
            workout__user=request.user
        ).select_related('workout').prefetch_related('sets').order_by('-workout__start_time')
        
        data = []
        for item in history_items:
            sets = item.sets.all()
            serialized_sets = WorkoutSetSerializer(sets, many=True).data
            
            session_1rm = 0
            session_1rm = item.session_1rm

            data.append({
                'workout_id': item.workout.id,
                'workout_name': item.workout.name,
                'date': item.workout.start_time,
                'session_1rm': session_1rm,
                'sets': serialized_sets
            })

        return Response(data)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def records(self, request, pk=None):
        # Retrieves max weight and best 1RM for this exercise for the user
        from workouts.models import WorkoutSet, WorkoutExercise


        max_weight_set = WorkoutSet.objects.filter(
            workout_exercise__exercise_id=pk,
            workout_exercise__workout__user=request.user
        ).select_related('workout_exercise__workout').order_by('-weight').first()

        best_1rm_exercise = WorkoutExercise.objects.filter(
            exercise_id=pk,
            workout__user=request.user
        ).select_related('workout').order_by('-session_1rm').first()

        if max_weight_set is None:
            reps = 0
            date = None
            weight = 0

        else:
            reps = max_weight_set.reps
            date = max_weight_set.workout_exercise.workout.start_time
            weight = float(max_weight_set.weight)


        if best_1rm_exercise is None:
            best_1rm_value = 0
            best_1rm_date = None
        else:
            best_1rm_value = best_1rm_exercise.session_1rm
            best_1rm_date = best_1rm_exercise.workout.start_time

        return Response({
            'max_weight': {
                'weight': weight,
                'reps': reps,
                'date': date    
            },
            'best_1rm': {
                'value': best_1rm_value,
                'date': best_1rm_date
            }
        })