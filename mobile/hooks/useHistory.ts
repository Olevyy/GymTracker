// 
import { useState, useEffect, useCallback } from 'react';
import { getWorkoutsHistory, WorkoutHistoryItem } from '@/services/historyService';

export function useHistory() {
    const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Default date range: last 30 days
    const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
});
    const [endDate, setEndDate] = useState(new Date());

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Format date to YYYY-MM-DD
            const fromDateStr = startDate.toISOString().split('T')[0];
            const toDateStr = endDate.toISOString().split('T')[0];
            const data = await getWorkoutsHistory(fromDateStr, toDateStr);
            setWorkouts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch workout history.');
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { 
        workouts, 
        loading, 
        error, 
        startDate, 
        endDate, 
        setStartDate, 
        setEndDate,
        refetch: fetchHistory 
    };
}