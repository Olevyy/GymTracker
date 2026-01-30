from rest_framework import serializers
from .models import Exercise, Muscle, Equipment

class ExerciseSerializer(serializers.ModelSerializer):
    # Use SlugRelatedField to represent related fields by their names
    primary_muscles = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        queryset=Muscle.objects.all()
    )
    secondary_muscles = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        queryset=Muscle.objects.all()
    )
    equipment = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        queryset=Equipment.objects.all()
    )
    class Meta:
        model = Exercise
        fields = '__all__'

class ExerciseListSerializer(serializers.ModelSerializer):
    primary_muscles = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        read_only=True
    )
    secondary_muscles = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        read_only=True
    )
    equipment = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        read_only=True
    )
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'image_urls', 'primary_muscles', 'secondary_muscles', 'equipment', 'level', 'category', 'mechanic', 'force']