import { apiFetch } from '@/services/apiClient';
import { ENDPOINTS } from '@/constants/api';

export interface TemplateExercise {
    id: number;
    exercise_id: number;
    exercise_name: string;
    order: number;
    sets_count: number;
}

export interface WorkoutTemplate {
    id: number;
    name: string;
    notes?: string;
    exercises: TemplateExercise[];
}


export interface CreateTemplatePayload {
    name: string;
    notes?: string;
    exercises: {
        exercise_id: number;
        order: number;
        sets_count: number;
    }[];
}

export async function getTemplates(): Promise<WorkoutTemplate[]> {
    const response = await apiFetch(ENDPOINTS.TEMPLATES);
    
    if (!response.ok) {
        throw new Error('Failed to fetch templates');
    }

    return await response.json();
}

export async function getTemplateById(id: number): Promise<WorkoutTemplate> {
    const response = await apiFetch(`${ENDPOINTS.TEMPLATES}${id}/`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch template details');
    }

    return await response.json();
}

export async function createTemplate(data: CreateTemplatePayload): Promise<WorkoutTemplate> {
    const response = await apiFetch(ENDPOINTS.TEMPLATES, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create template');
    }

    return await response.json();
}

export async function deleteTemplate(id: number): Promise<void> {
    const response = await apiFetch(`${ENDPOINTS.TEMPLATES}${id}/`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete template');
    }
}

export async function updateTemplate(id: number, data: Partial<CreateTemplatePayload>): Promise<WorkoutTemplate> {
    const response = await apiFetch(`${ENDPOINTS.TEMPLATES}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update template');
    }

    return await response.json();
}

