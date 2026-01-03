import { apiFetch } from '@/services/apiClient';
import { ENDPOINTS } from '@/constants/api';
import { Exercise, Muscle, Category, Level } from '@/types/exercise'; 

export interface PaginatedExercises {
    count: number;
    next: string | null;
    previous: string | null;
    results: Exercise[];
}

export interface FetchExercisesParams {
    page?: number;
    search?: string;
    muscle?: Muscle;     
    level?: Level;      
    category?: Category; 
}

export interface ExerciseHistoryItem {
    workout_id: number;
    workout_name: string;
    date: string;
    session_1rm: number;
    sets: {
        id: number;
        weight: string;
        reps: number;
        order: number;
        one_rep_max: number;
    }[];
}

export interface ExerciseRecordValue {
    value: number;
    weight: number;
    reps: number;
    date: string;
    workout_id: number;
}

export interface ExerciseRecords {
    max_weight: ExerciseRecordValue | null;
    best_1rm: ExerciseRecordValue | null;
}

export async function getExercises(params: FetchExercisesParams = {}): Promise<PaginatedExercises> {
    const query = new URLSearchParams();
    
    if (params.page) query.append('page', params.page.toString());
    if (params.search) query.append('name', params.search);
    if (params.muscle) query.append('muscle', params.muscle);
    if (params.level) query.append('level', params.level);
    if (params.category) query.append('category', params.category);

    const endpoint = `${ENDPOINTS.EXERCISES}?${query.toString()}`;
    const response = await apiFetch(endpoint);
    
    if (!response.ok) {
        throw new Error('Failed to fetch exercises');
    }

    return await response.json();
}

export async function getExerciseById(id: string | number): Promise<Exercise> {
    const endpoint = `${ENDPOINTS.EXERCISES}${id}/`;
    
    const response = await apiFetch(endpoint);
    
    if (!response.ok) {
        throw new Error('Failed to fetch exercise details');
    }

    return await response.json();
}

export async function getExerciseHistory(id: string): Promise<ExerciseHistoryItem[]> {
    const response = await apiFetch(`${ENDPOINTS.EXERCISES}${id}/history/`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
}

export async function getExerciseRecords(id: string): Promise<ExerciseRecords> {
    const response = await apiFetch(`${ENDPOINTS.EXERCISES}${id}/records/`);
    if (!response.ok) throw new Error('Failed to fetch records');
    return await response.json();
}