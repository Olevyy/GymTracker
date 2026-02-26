// Exercise data, including details, history and records
import { useState, useEffect, useCallback } from 'react';
import { 
    getExerciseById, 
    getExerciseHistory, 
    getExerciseRecords,
    ExerciseHistoryItem, 
    ExerciseRecords 
} from '@/services/exercisesService';
import { Exercise } from '@/types/exercise';

export function useExerciseData(exerciseId: string | undefined) {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [history, setHistory] = useState<ExerciseHistoryItem[]>([]);
    const [records, setRecords] = useState<ExerciseRecords | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!exerciseId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Get all data
            const [exData, histData, recData] = await Promise.all([
                getExerciseById(exerciseId),
                getExerciseHistory(exerciseId),
                getExerciseRecords(exerciseId)
            ]);

            setExercise(exData);
            setHistory(histData);
            setRecords(recData);
        } catch (err) {
            console.error(err);
            setError('Failed to load exercise data');
        } finally {
            setLoading(false);
        }
    }, [exerciseId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { exercise, history, records, loading, error, refetch: fetchData };
}