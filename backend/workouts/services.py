# Helper module for generating user workout statistics
from django.utils import timezone
from datetime import timedelta
from .models import Workout, WorkoutSet
from collections import defaultdict
from django.db.models import Q, Sum, F, Count
from django.apps import apps

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
    user: User object
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
        sets = WorkoutSet.objects.filter(
            workout_exercise__workout__user=user,
            workout_exercise__workout__start_time__date__gte=start_time,
            workout_exercise__workout__start_time__date__lte=today,
        ).select_related('workout_exercise__workout')

        sets = sets.filter(
            Q(workout_exercise__exercise__primary_muscles__icontains=muscle) |
            Q(workout_exercise__exercise__secondary_muscles__icontains=muscle)
        )

        for one_set in sets:
            workout_date = one_set.workout_exercise.workout.start_time.date() # Date of the workout
            first_of_month = workout_date.replace(day=1) # Get first day of that month
            vol = float(one_set.weight) * one_set.reps
            monthly_volume[first_of_month] += vol
            unique_workouts.add(one_set.workout_exercise.workout.id)
    
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


def calculate_1rm(weight, reps):
    if reps == 0: return 0
    if reps == 1: return weight
    return weight * (1 + (reps / 30))

# Generate workout summary including total volume and new personal records
def get_workout_summary(workout):
    PersonalRecord = apps.get_model('stats', 'Personal_Record')
    user = workout.user
    # Get all sets in the workout
    sets = WorkoutSet.objects.filter(
        workout_exercise__workout=workout
    ).select_related('workout_exercise__exercise', 'workout_exercise')
    total_volume = 0.0
    
    # { exercise_id: { 'max_1rm': float, 'name': str } }
    session_bests = {}

    for one_set in sets:
        weight = float(one_set.weight)
        reps = one_set.reps
        total_volume += weight * reps

        # Check if this set is a personal best for the exercise in this session
        current_1rm = getattr(one_set, 'one_rep_max', calculate_1rm(weight, reps))
        ex_id = one_set.workout_exercise.exercise.id
        
        if ex_id not in session_bests:
            session_bests[ex_id] = {
                'max_1rm': 0.0, 
                'name': one_set.workout_exercise.exercise.name,
                'workout_exercise': one_set.workout_exercise

            }
        
        # If set's 1RM is better than current best for this exercise in the session, update it
        if current_1rm > session_bests[ex_id]['max_1rm']:
            session_bests[ex_id]['max_1rm'] = current_1rm
            

    # Save total volume to workout
    workout.total_volume = round(total_volume, 1)
    workout.save(update_fields=['total_volume'])

    new_records = []

    for ex_id, best_data in session_bests.items():
        achieved_1rm = best_data['max_1rm']
        workout_exercise_instance = best_data['workout_exercise']
        # Check history for existing PR
        existing_pr = PersonalRecord.objects.filter(
            workout_exercise__workout__user=user,
            workout_exercise__exercise_id=ex_id
        ).order_by('-one_rep_max').first()

        old_1rm = existing_pr.one_rep_max if existing_pr else 0.0

        if achieved_1rm > old_1rm:
            PersonalRecord.objects.create(
                workout_exercise=workout_exercise_instance,
                one_rep_max=achieved_1rm
            )
            
            new_records.append({
                "exercise_name": best_data['name'],
                "old_1rm": round(old_1rm, 1),
                "new_1rm": round(achieved_1rm, 1),
                "is_new": old_1rm == 0
            })

    return {
        "id": workout.id,
        "total_volume": round(total_volume, 1),
        "new_records": new_records
    }