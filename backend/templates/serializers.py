from rest_framework import serializers
from .models import WorkoutTemplate, TemplateExercise
from exercises.models import Exercise

class TemplateExerciseSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), 
        source='exercise',
        write_only=True
    )

    class Meta:
        model = TemplateExercise
        fields = ['id', 'exercise_id', 'exercise_name', 'order', 'sets_count']

class WorkoutTemplateSerializer(serializers.ModelSerializer):
    exercises = TemplateExerciseSerializer(many=True)

    class Meta:
        model = WorkoutTemplate
        fields = ['id', 'name', 'notes', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        template = WorkoutTemplate.objects.create(**validated_data)
        
        for ex_data in exercises_data:
            TemplateExercise.objects.create(template=template, **ex_data)
            
        return template

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.save()
        return instance