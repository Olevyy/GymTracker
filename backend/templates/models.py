from django.db import models
from django.conf import settings

class WorkoutTemplate(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='templates'
    )
    name = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)
    
    # Fieldy used only to return sorted templates
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

# Exercises within template, basic data only
class TemplateExercise(models.Model):
    template = models.ForeignKey(
        WorkoutTemplate, 
        on_delete=models.CASCADE, 
        related_name='exercises'
    )
    # Exercise relation
    exercise = models.ForeignKey('exercises.Exercise', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    sets_count = models.PositiveIntegerField(default=3)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.exercise} in {self.template.name}"