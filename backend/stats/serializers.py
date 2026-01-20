from rest_framework import serializers
from .models import Personal_Record

class PersonalRecordSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='workout_exercise.exercise.name', read_only=True)
    date_achieved = serializers.DateTimeField(source='workout_exercise.workout.start_time', read_only=True, format="%Y-%m-%d")
    workout_id = serializers.IntegerField(source='workout_exercise.workout.id', read_only=True)
    class Meta:
        model = Personal_Record
        fields = ['id', 'exercise_name', 'one_rep_max', 'date_achieved', 'workout_id']