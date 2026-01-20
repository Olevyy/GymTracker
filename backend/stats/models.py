from django.db import models
from django.conf import settings
# Create your models here.
class Personal_Record(models.Model):
    workout_exercise = models.OneToOneField(
        'workouts.WorkoutExercise', 
        on_delete=models.CASCADE, 
        related_name='is_personal_record'
    )
    one_rep_max = models.FloatField()

    class Meta:
        indexes = [
            models.Index(fields=['-one_rep_max']),
        ]

    def __str__(self):
        return f"PR: {self.workout_exercise.exercise.name} - {self.one_rep_max} kg"