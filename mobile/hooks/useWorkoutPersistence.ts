// Communication with AsyncStorage to persist workout state across app restarts
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveExercise } from '@/components/workout/workoutExercise';

const STORAGE_KEY = 'CURRENT_WORKOUT_STATE_V1';


export interface PersistedState {
    workoutName: string;
    notes: string;
    activeExercises: ActiveExercise[];
    startTime: string;
}

export function useWorkoutPersistence() {
    const [isLoading, setIsLoading] = useState(true);

    const saveState = async (state: PersistedState) => {
        try {
            if (state.activeExercises.length > 0 || state.workoutName !== 'New Workout') {
                const jsonValue = JSON.stringify(state);
                await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
            }
        } catch (e) {
            console.error("Failed to save workout state", e);
        }
    };

    const loadState = async (): Promise<PersistedState | null> => {
        setIsLoading(true);
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error("Failed to load workout state", e);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const clearStorage = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Failed to clear workout storage", e);
        }
    };

    return {
        isLoading,
        saveState,
        loadState,
        clearStorage
    };
}