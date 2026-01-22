from django.core.management.base import BaseCommand
from workouts.models import Workout
from workouts.services import calculate_workout_summary
from django.apps import apps

class Command(BaseCommand):
    help = 'Recalculate workout summaries and personal records for all workouts.'

    def handle(self, *args, **kwargs):


        # Get all workouts ordered by date
        workouts = Workout.objects.all().order_by('start_time')
        count = workouts.count()
        
        if count == 0:
            return

        self.stdout.write(f"Found {count} workouts. Starting recalculation...")

        for workout in workouts:
            calculate_workout_summary(workout)
            
        self.stdout.write(self.style.SUCCESS(f"Done! Recalculated {count} workouts"))