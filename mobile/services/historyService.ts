// Service to fetch workout history data from the backend API
import { apiFetch } from './apiClient';
import { ENDPOINTS } from '@/constants/api';

export interface WorkoutHistoryItem {
    id: number;
    name: string;
    start_time: string;
    end_time: string | null;
    status: 'in_progress' | 'completed';
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