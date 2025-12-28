from django.db import models
from django.contrib.postgres.fields import ArrayField

class Exercise(models.Model):
    # --- ENUMS ---
    class Mechanic(models.TextChoices):
        COMPOUND = 'compound', 'Compound'
        ISOLATION = 'isolation', 'Isolation'

    class Force(models.TextChoices):
        PULL = 'pull', 'Pull'
        PUSH = 'push', 'Push'
        STATIC = 'static', 'Static'

    class Level(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        EXPERT = 'expert', 'Expert'

    class Category(models.TextChoices):
        STRENGTH = 'strength', 'Strength'
        STRETCHING = 'stretching', 'Stretching'
        PLYOMETRICS = 'plyometrics', 'Plyometrics'
        STRONGMAN = 'strongman', 'Strongman'
        POWERLIFTING = 'powerlifting', 'Powerlifting'
        CARDIO = 'cardio', 'Cardio'
        OLYMPIC_WEIGHTLIFTING = 'olympic weightlifting', 'Olympic Weightlifting'
        CROSSFIT = 'crossfit', 'Crossfit'
        WEIGHTED_BODYWEIGHT = 'weighted bodyweight', 'Weighted Bodyweight'
        ASSISTED_BODYWEIGHT = 'assisted bodyweight', 'Assisted Bodyweight'

    # --- FIELDS ---
    name = models.CharField(max_length=255, unique=True)
    
    # Arrays (Postgres ArrayField)
    primary_muscles = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    secondary_muscles = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    instructions = ArrayField(models.TextField(), blank=True, default=list)
    # List of image URLs
    image_urls = ArrayField(models.URLField(max_length=500), blank=True, default=list)

    force = models.CharField(max_length=20, choices=Force.choices, null=True, blank=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    mechanic = models.CharField(max_length=20, choices=Mechanic.choices, null=True, blank=True)
    equipment = models.CharField(max_length=50, null=True, blank=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.STRENGTH)
    

    def __str__(self):
        return self.name