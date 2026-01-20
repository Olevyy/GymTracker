from rest_framework import serializers
from .models import Workout, WorkoutExercise, WorkoutSet
from exercises.serializers import ExerciseListSerializer 
from stats.serializers import PersonalRecordSerializer
class WorkoutSetSerializer(serializers.ModelSerializer):
    # Field calculated (read-only)
    one_rep_max = serializers.FloatField(read_only=True)

    class Meta:
        model = WorkoutSet
        fields = ['id', 'weight', 'reps', 'order', 'one_rep_max']

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    sets = WorkoutSetSerializer(many=True)
    # ID exercise to save
    exercise_id = serializers.IntegerField(write_only=True)
    # Exercise details to read (name, category, thumbnail)
    exercise_details = ExerciseListSerializer(source='exercise', read_only=True)
    personal_record = PersonalRecordSerializer(source='is_personal_record', read_only=True, allow_null=True)
    class Meta:
        model = WorkoutExercise
        fields = ['id', 'exercise_id', 'exercise_details', 'order', 'sets', 'personal_record']


class WorkoutListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'start_time', 'status', 'total_volume']

class WorkoutSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True)
    broken_records = PersonalRecordSerializer(source='records_set', many=True, read_only=True)
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'start_time', 'status', 'notes','total_volume','exercises', 'broken_records']

    def create(self, validated_data):
        # Create overwriting to handle nested creation
        exercises_data = validated_data.pop('exercises')
        # Create Workout
        workout = Workout.objects.create(**validated_data)

        for ex_data in exercises_data:
            sets_data = ex_data.pop('sets')
            exercise_id = ex_data.pop('exercise_id')
            
            # Add exercise to workout (WorkoutExercise)
            workout_exercise = WorkoutExercise.objects.create(
                workout=workout, 
                exercise_id=exercise_id,
                **ex_data
            )

            # Adding sets
            for set_data in sets_data:
                WorkoutSet.objects.create(workout_exercise=workout_exercise, **set_data)

        return workout