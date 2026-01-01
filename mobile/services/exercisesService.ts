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