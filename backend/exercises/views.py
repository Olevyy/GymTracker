import django_filters
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Exercise
from .serializers import ExerciseSerializer

# Pagination class 20 items per page
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# Filter class for Exercise
class ExerciseFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    equipment = django_filters.CharFilter(lookup_expr='icontains')
    
    # Custom filter for primary muscle
    muscle = django_filters.CharFilter(method='filter_by_muscle')

    class Meta:
        model = Exercise
        fields = ['level', 'category', 'mechanic', 'force'] # exact matches

    def filter_by_muscle(self, queryset, name, value):
        return queryset.filter(primary_muscles__contains=[value])

# Auto-generated CRUD endpoints for Exercise
class ExerciseViewSet(viewsets.ReadOnlyModelViewSet): # ReadOnly
    queryset = Exercise.objects.all().order_by('name')
    serializer_class = ExerciseSerializer
    pagination_class = StandardResultsSetPagination
    
    filter_backends = [
        DjangoFilterBackend,   # ?level=beginner&category=strength
        filters.SearchFilter,  # ?search=...
    ] 

    filterset_class = ExerciseFilter
    search_fields = ['name']
