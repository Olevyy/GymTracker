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
    notes: string;
    exercises: WorkoutExercisePayload[];
}

export interface HeatmapData {
    slug: string;  
    intensity: number; 
}

export interface WorkoutStats {
    workouts_count: number;
    total_volume: number;
    palette: string[]; 
    body_parts: HeatmapData[];
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

export async function getWorkoutStats(): Promise<WorkoutStats> {
    const response = await apiFetch(`${ENDPOINTS.WORKOUTS}weekly-stats/`); 
    
    if (!response.ok) {
        throw new Error('Failed to fetch workout stats');
    }

    return await response.json();
}