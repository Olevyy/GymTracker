# Module which uses workout data for user and provides weekly sumaries and heatmap for the mobile apllication
from django.utils import timezone
from datetime import timedelta
from .models import Workout, WorkoutSet
from collections import defaultdict
from django.db.models import Q

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


def get_volume_workouts_data(user, filter_type='all', muscle = None, days = 365):
    today = timezone.now().date()
    start_time = today - timedelta(days=days)

    sets = WorkoutSet.objects.filter( # Sets in period for user
        workout_exercise__workout__user=user,
        workout_exercise__workout__start_time__date__gte=start_time,
        workout_exercise__workout__start_time__date__lte=today
    ).select_related('workout_exercise__workout', 'workout_exercise__exercise') # To avoid additional queries

    if muscle: 
        sets = sets.filter( # Contains muscle in primary or secondary muscles
            Q(workout_exercise__exercise__primary_muscles__icontains=muscle) |
            Q(workout_exercise__exercise__secondary_muscles__icontains=muscle)
    )


    weekly_volume = defaultdict(float)
    unique_workouts = set() # To count overall amount of workouts in period
    for one_set in sets:
        workout_date = one_set.workout_exercise.workout.start_time.date()
        monday = workout_date - timedelta(days=workout_date.weekday()) # Get monday of that week
        vol = float(one_set.weight) * one_set.reps
        weekly_volume[monday] += vol
        unique_workouts.add(one_set.workout_exercise.workout.id)
    
    chart_data = []


    cur_monday = start_time - timedelta(days=start_time.weekday())
    while cur_monday <= today: # For each week add data point
        volume = weekly_volume.get(cur_monday, 0)
        chart_data.append({
        "value": round(volume, 1),
        "label": cur_monday.strftime('%d.%m'), # Day and month
        })
        cur_monday += timedelta(weeks=1) # Next week

    return {
    "chart": chart_data,
    "summary": {
        "total_workouts": len(unique_workouts), 
        "total_volume": round(sum(weekly_volume.values()), 1)
        }
    }