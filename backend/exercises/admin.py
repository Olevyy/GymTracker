from django.contrib import admin
from .models import Exercise

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'muscle_group_display', 'level')
    # Search and filter options
    search_fields = ('name', 'primary_muscles')
    list_filter = ('category', 'level', 'force')
    # Custom display for primary muscles
    def muscle_group_display(self, obj):
        return ", ".join(obj.primary_muscles[:3])
    muscle_group_display.short_description = "Primary Muscles"