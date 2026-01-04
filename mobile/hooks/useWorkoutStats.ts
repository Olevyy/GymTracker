// Fetch and return workouts stat data
import { useState, useEffect, useCallback } from 'react';
import { getWorkoutStats, WorkoutStats } from '@/services/workoutService';
import { Alert } from 'react-native';

export function useWorkoutStats() {
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const data = await getWorkoutStats();
            setStats(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not load stats");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    return { stats, loading, refreshing, onRefresh };
}