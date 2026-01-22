import { apiFetch } from './apiClient';
import { ENDPOINTS } from '@/constants/api';
import { Muscle } from '@/types/exercise';

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
    start_time: string;
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

export interface ChartDataPoint {
    value: number;
    label: string;
    date?: string;
}

export interface VolumeStatsSummary {
    total_workouts: number;
    total_volume: number;
}

export interface VolumeStatsResponse {
    chart: ChartDataPoint[];
    summary: VolumeStatsSummary;
}

export async function getVolumeStats(muscle?: Muscle | null): Promise<VolumeStatsResponse> {
    let url = `${ENDPOINTS.WORKOUTS}volume-chart/`;
    
    if (muscle) {
        url += `?muscle=${encodeURIComponent(muscle)}`;
    }

    const response = await apiFetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch volume stats');
    }

    return await response.json();
}