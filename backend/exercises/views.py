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
        from workouts.serializers import WorkoutSetSerializer
        
        exercise = self.get_object()

        history_items = WorkoutExercise.objects.filter(
            exercise=exercise, 
            workout__user=request.user
        ).select_related('workout').prefetch_related('sets').order_by('-workout__start_time')[:10]
        
        data = []
        for item in history_items:
            sets = item.sets.all()
            serialized_sets = WorkoutSetSerializer(sets, many=True).data
            
            session_1rm = 0
            if sets:
                # Highest 1rm for each session exercise
                session_1rm = max([s.one_rep_max for s in sets])

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
        from workouts.models import WorkoutSet

        #Retrieves max weight and best 1RM for this exercise for the user

        base_qs = WorkoutSet.objects.filter(
            workout_exercise__exercise_id=pk,
            workout_exercise__workout__user=request.user
        ).select_related('workout_exercise__workout')
        
        max_weight_set = base_qs.order_by('-weight', '-reps').first()
        best_1rm_set = base_qs.order_by('-one_rep_max').first()

        # Helper to format record response
        def format_record(record_set, value_key):
            if not record_set:
                return None
            
            workout = record_set.workout_exercise.workout 
            return {
                'weight': record_set.weight,
                'reps': record_set.reps,
                'value': getattr(record_set, 'one_rep_max', 0) if record_set == best_1rm_set else record_set.weight,
                'date': workout.start_time,
                'workout_id': workout.id
            }
        return Response({
            'max_weight': format_record(max_weight_set, value_key='weight'),
            'best_1rm': format_record(best_1rm_set, value_key='one_rep_max')
        })