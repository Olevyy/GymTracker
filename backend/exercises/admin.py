from django.contrib import admin
from .models import Exercise

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'muscle_group_display', 'level')
    # Search and filter options
    search_fields = ('name', 'primary_muscles__name')
    list_filter = ('category', 'level', 'force')
    # Custom display for primary muscles
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('primary_muscles')


    def muscle_group_display(self, obj):

        muscles = [m.name for m in obj.primary_muscles.all()[:3]]
        return ", ".join(muscles)
    
    muscle_group_display.short_description = "Primary Muscles"