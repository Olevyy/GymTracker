// Service to fetch workout history data from the backend API
import { apiFetch } from './apiClient';
import { ENDPOINTS } from '@/constants/api';
import { Exercise } from '@/types/exercise';
export interface WorkoutHistoryItem {
    id: number;
    name: string;
    start_time: string;
    end_time: string | null;
    status: 'in_progress' | 'completed';
}

export interface HistorySet {
    id: number;
    weight: string; 
    reps: number;
    order: number;
    one_rep_max: number;
}

export interface HistoryExercise {
    id: number; 
    exercise_details: Exercise; 
    order: number;
    sets: HistorySet[];
}

export interface WorkoutDetail {
    id: number;
    name: string;
    start_time: string;
    status: 'completed' | 'in_progress';
    notes: string;
    exercises: HistoryExercise[];
}


export async function getWorkoutsHistory(fromDate: string, toDate: string): Promise<WorkoutHistoryItem[]> {
    const params = new URLSearchParams();
    params.append('from_date', fromDate); 
    params.append('to_date', toDate);    

    const endpointWithParams = `${ENDPOINTS.WORKOUTS}?${params.toString()}`;

    // Use the apiFetch function to make the authenticated request
    const response = await apiFetch(endpointWithParams, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Something went wrong while fetching workout history.');
    }

    return await response.json();
}


export async function getWorkoutDetails(id: string): Promise<WorkoutDetail> {
    

    const response = await apiFetch(`${ENDPOINTS.WORKOUTS}${id}/`);
    if (!response.ok) throw new Error('Failed to fetch workout details');
    return await response.json();
}

// Patch set
export async function updateWorkoutSet(setId: number, data: { weight?: number, reps?: number }) {
    const response = await apiFetch(`${ENDPOINTS.WORKOUT_SETS}${setId}/`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update set');
    return await response.json();
}

// Remove set
export async function deleteWorkoutSet(setId: number) {
    const response = await apiFetch(`${ENDPOINTS.WORKOUT_SETS}${setId}/`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete set');
    return true; 
}

// Remove workout from exercise
export async function deleteWorkoutExercise(workoutExerciseId: number) {
    const response = await apiFetch(`${ENDPOINTS.WORKOUT_EXERCISES}${workoutExerciseId}/`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete exercise');
    return true;
}

export async function deleteWorkout(workoutId: number) {
    const response = await apiFetch(`${ENDPOINTS.WORKOUTS}${workoutId}/`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete workout');
    }
    
    return true; 
}