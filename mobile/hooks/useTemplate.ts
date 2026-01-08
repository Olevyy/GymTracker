import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getTemplates, deleteTemplate , WorkoutTemplate } from '@/services/templateService';
import { Alert } from 'react-native';

export function useTemplates() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTemplates();
            setTemplates(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load routines');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTemplates();
        }, [loadTemplates])
    );

    const removeTemplate = async (id: number) => {
        try {
            await deleteTemplate(id);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            Alert.alert("Error", "Failed to delete template");
            loadTemplates();
        }
    };

    return { 
        templates, 
        loading, 
        error, 
        refresh: loadTemplates, 
        removeTemplate 
    };
}