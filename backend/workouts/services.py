# Helper module for generating user workout statistics
from django.utils import timezone
from datetime import timedelta
from .models import Workout, WorkoutSet
from collections import defaultdict
from django.db.models import Q, Sum, F, Count
from .models import Workout, WorkoutSet, WorkoutExercise

def get_heat_intensity(sets_count):
    if sets_count <= 0: return 1 
    if sets_count < 6:  return 2  
    if sets_count < 12: return 3  
    if sets_count < 16: return 4  
    return 5

# Muscles types which we have in db mapped into ones accepted by component we use
MUSCLE_MAPPING = {
    "abdominals":   ["abs", "obliques"],
    "hamstrings":   ["hamstring"],       
    "calves":       ["calves", "tibialis"],
    "shoulders":    ["deltoids"],       
    "adductors":    ["adductors"],        
    "glutes":       ["gluteal"],       
    "quadriceps":   ["quadriceps", "knees"],
    "biceps":       ["biceps"],           
    "forearms":     ["forearm"],              
    "abductors":    ["gluteal"],
    "triceps":      ["triceps"],
    "chest":        ["chest"],
    "lower_back":   ["lower-back"],
    "traps":        ["trapezius"],
    "middle_back":  ["upper-back"],
    "lats":         ["upper-back"],
    "neck":         ["neck"],
}

STATIC_BODY_PARTS = ["head", "hands", "feet", "ankles"]

# Get weekly stats for user including body part intensity
def get_weekly_stats(user):
    
    before = timezone.now() - timedelta(days=7) # Earliest we track
    workouts = Workout.objects.filter(
        user=user,
        start_time__gte = before # After this date
    )
    workouts_count = workouts.count()

    # Select * from WorkoutSet where workout.user = user and workout.start_time >= before 
    sets = WorkoutSet.objects.filter(
        workout_exercise__workout__user=user,
        workout_exercise__workout__start_time__gte=before
    ).select_related('workout_exercise__exercise') # 

    muscle_sets = defaultdict(float)
    volume = 0.0


    # Foreach set we count volume and track mussles we used
    for one_set in sets:
        exercise = one_set.workout_exercise.exercise
        weight = float(one_set.weight)
        reps = one_set.reps
        volume += weight * reps
        
        # Count sets for each muscle type
        if exercise.primary_muscles:
            for muscle in exercise.primary_muscles:
                clean_name = str(muscle).lower().strip()
                muscle_sets[clean_name] += 1.0

        if exercise.secondary_muscles:
            for muscle in exercise.secondary_muscles:
                clean_name = str(muscle).lower().strip()
                muscle_sets[clean_name] += 0.5

    intensity = defaultdict(float)

    for db_muscle, count in muscle_sets.items():
        target_slugs = MUSCLE_MAPPING.get(db_muscle) # Muscles from db mapped into corresponding slug
        if target_slugs:
            for slug in target_slugs: # asigning value
                intensity[slug] += count

    body_data_list = []

    # Generate all muscles so untrained muscles also will have value
    all_supported_muscles =  set(STATIC_BODY_PARTS) # Always default color
    for slug_list in MUSCLE_MAPPING.values():
        for slug in slug_list:
            all_supported_muscles.add(slug)
    
    for slug in all_supported_muscles:
        val = intensity.get(slug, 0)
        body_data_list.append({
            "slug": slug,
            "intensity": get_heat_intensity(val) # Map sets count to intensivity
        })

    return {
        "workouts_count": workouts_count,
        "total_volume": round(volume, 1),
        "body_parts": body_data_list  # {Slug, intensivity}
    }

# Get volume of workouts for user over time (grouped monthly) for generating volume chart
def get_workouts_volume(user, muscle = None, days = 365):
    """
    muscle: muscle name to filter by or None for all muscles
    days: number of days in the past to include in the data
    """

    today = timezone.now().date()
    start_time = today - timedelta(days=days)
    monthly_volume = defaultdict(float)
    unique_workouts = set() # To count overall amount of workouts in period

    if not muscle:
        workouts = Workout.objects.filter(
            user=user,
            start_time__date__gte=start_time,
            start_time__date__lte=today
        )
        
        for workout in workouts:
            workout_date = workout.start_time.date()
            first_of_month = workout_date.replace(day=1)
            
            # Accumulate total volume per month
            monthly_volume[first_of_month] += workout.total_volume
            unique_workouts.add(workout.id)

    else:
        # Filter sets by muscle
        workout_exercise = WorkoutExercise.objects.filter(
            workout__user = user,
            workout__start_time__date__gte=start_time,
            workout__start_time__date__lte=today,
        ).select_related('workout')

        workout_exercise = workout_exercise.filter(
            Q(exercise__primary_muscles__icontains=muscle) |
            Q(exercise__secondary_muscles__icontains=muscle)
        )

        for exercise in workout_exercise:
            date = exercise.workout.start_time.date()
            first_of_month = date.replace(day=1)
            monthly_volume[first_of_month] += exercise.session_volume
            unique_workouts.add(exercise.workout.id)
    chart_data = []


    current = start_time.replace(day=1)
    while current <= today: # For each month add data point
        volume = monthly_volume.get(current, 0)
        chart_data.append({
        "value": round(volume, 1),
        "label": current.strftime('%b'), # Day and month
        "date": current.strftime('%Y-%m-%d')
        })
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)

    return {
    "chart": chart_data,
    "summary": {
        "total_workouts": len(unique_workouts), 
        "total_volume": round(sum(monthly_volume.values()), 1)
        }
    }

# Calculate 1rm based on weight and reps using Epley formula
def calculate_1rm(weight, reps):
    if reps == 0: return 0
    if reps == 1: return weight
    return weight * (1 + (reps / 30))

# Generate workout summary including total volume and new personal records
# Supposed to be run only after workout is completed or edited
def calculate_workout_summary(workout):

    # Get all sets in the workout
    exercises = WorkoutExercise.objects.filter(
        workout=workout
    ).select_related('exercise').prefetch_related('sets')
    total_volume = 0.0
    
    new_records = []

    for one_exercise in exercises:
        session_volume = 0.0
        session_1rm = 0.0
        for one_set in one_exercise.sets.all():
            weight = float(one_set.weight)
            reps = one_set.reps
            session_volume += weight * reps
            set_1rm = calculate_1rm(weight, reps)
            if set_1rm > session_1rm:
                session_1rm = set_1rm
        
        total_volume += session_volume
        one_exercise.session_volume = round(session_volume, 1)
        one_exercise.session_1rm = round(session_1rm, 1)
        one_exercise.save(update_fields=['session_volume', 'session_1rm'])

        global_best = (
            WorkoutExercise.objects.filter(
                workout__user=workout.user,
                exercise=one_exercise.exercise)
                .exclude(id=one_exercise.id)  # Exclude current exercise
                .order_by('-session_1rm')
                .first()
        )
        best_global = global_best.session_1rm if global_best else 0.0

        if session_1rm > best_global:
            new_records.append({
                "exercise_id": one_exercise.exercise.id,
                "exercise_name": one_exercise.exercise.name,
                "old_1rm": round(global_best.session_1rm, 1) if global_best else 0,
                "new_1rm": round(session_1rm, 1)
            })
    if workout.total_volume != total_volume:
        workout.total_volume = round(total_volume, 1)
        workout.save(update_fields=['total_volume'])

    return {
        "id": workout.id,
        "total_volume": round(total_volume, 1),
        "new_records": new_records
    }