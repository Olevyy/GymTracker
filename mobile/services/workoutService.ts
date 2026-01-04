import { apiFetch } from './apiClient';
import { ENDPOINTS } from '@/constants/api';


// Data types to send
export interface WorkoutSetPayload {
    weight: number;
    reps: number;
    order: number;
}

export interface WorkoutExercisePayload {
    exercise_id: number;
    order: number;
    sets: WorkoutSetPayload[];
}

export interface CreateWorkoutPayload {
    name: string;
    start_time: string; // ISO String
    notes: string;
    exercises: WorkoutExercisePayload[];
}



export async function createWorkout(workoutData: CreateWorkoutPayload) {
    const response = await apiFetch(ENDPOINTS.WORKOUTS, {
        method: 'POST',
        body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save workout');
    }

    return await response.json();
}