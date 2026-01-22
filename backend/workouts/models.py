from django.db import models
from django.conf import settings
from exercises.models import Exercise  # Import exercise model

# One training session
class Workout(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workouts') # Training belongs to a user
    name = models.CharField(max_length=100, default="Training Session")
    start_time = models.DateTimeField(db_index=True) # Start time, indexed for faster queries
    status = models.CharField(max_length=20, default='completed')  # e.g., completed, planned
    notes = models.TextField(blank=True, null=True)
    total_volume  = models.FloatField(default=0)  # Total volume lifted in the workout

    class Meta:
        indexes = [
            models.Index(fields=['user', '-start_time']),
        ]

    def __str__(self):
        return f"{self.name} ({self.start_time.date()})"

# Exercises within a workout
class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, related_name='exercises', on_delete=models.CASCADE) # Exercise belongs to a workout
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT) # If we somehow delete exercise, keep workout history
    order = models.PositiveIntegerField(default=0) # order within the workout
    session_1rm = models.FloatField(default=0.0)
    session_volume = models.FloatField(default=0.0)
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.exercise.name} in {self.workout.name}"

# Single set within an exercise
class WorkoutSet(models.Model):
    workout_exercise = models.ForeignKey(WorkoutExercise, related_name='sets', on_delete=models.CASCADE)
    weight = models.DecimalField(max_digits=6, decimal_places=2, default=0) # Weight of the set
    reps = models.PositiveIntegerField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        indexes = [
            models.Index(fields=['weight']),
        ]
