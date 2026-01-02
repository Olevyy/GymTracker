import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
    getWorkoutDetails, 
    updateWorkoutSet, 
    deleteWorkoutSet, 
    deleteWorkoutExercise, 
    deleteWorkout,
    WorkoutDetail, 
    HistorySet 
} from '@/services/historyService';

export function useWorkoutDetail(workoutId: string | undefined) {
    const router = useRouter();

    // Data state
    const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [editingSet, setEditingSet] = useState<HistorySet | null>(null);
    const [editWeight, setEditWeight] = useState('');
    const [editReps, setEditReps] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // -Fetching data
    const fetchDetails = useCallback(async () => {
        if (!workoutId) return;
        try {
            setLoading(true);
            const data = await getWorkoutDetails(workoutId);
            setWorkout(data);
        } catch (error) {
            Alert.alert("Error", "Could not load workout details");
            router.back();
        } finally {
            setLoading(false);
        }
    }, [workoutId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // --- ACTIONS: MODAL & INPUTS ---
    const openEditModal = (set: HistorySet) => {
        setEditingSet(set);
        setEditWeight(set.weight.toString());
        setEditReps(set.reps.toString());
    };

    const closeEditModal = () => {
        setEditingSet(null);
        setEditWeight('');
        setEditReps('');
    };

    // --- ACTIONS: API OPERATIONS ---

    const saveSetChanges = async () => {
        if (!editingSet) return;
        setIsSaving(true);
        try {
            await updateWorkoutSet(editingSet.id, {
                weight: parseFloat(editWeight),
                reps: parseInt(editReps)
            });
            closeEditModal();
            fetchDetails(); // Odśwież widok
        } catch (error) {
            Alert.alert("Error", "Failed to update set");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSet = async () => {
        if (!editingSet) return;
        Alert.alert("Delete Set", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await deleteWorkoutSet(editingSet.id);
                        closeEditModal();
                        fetchDetails();
                    } catch(e) { Alert.alert("Error", "Failed to delete set"); }
                } 
            }
        ]);
    };

    const handleDeleteExercise = (exerciseId: number) => {
        Alert.alert("Remove Exercise", "This will remove the exercise and all its sets.", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Remove", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await deleteWorkoutExercise(exerciseId);
                        fetchDetails();
                    } catch(e) { Alert.alert("Error", "Failed to remove exercise"); }
                } 
            }
        ]);
    };

    const handleDeleteWorkout = () => {
        Alert.alert(
            "Delete Workout",
            "Are you sure you want to delete this entire workout history?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            if (!workout) return;
                            await deleteWorkout(workout.id);
                            router.back(); 
                        } catch (e) {
                            Alert.alert("Error", "Failed to delete workout");
                        }
                    } 
                }
            ]
        );
    };

    return {
        // Data
        workout,
        loading,
        // Edit State
        editingSet,
        editWeight, setEditWeight,
        editReps, setEditReps,
        isSaving,
        // Actions
        refresh: fetchDetails,
        openEditModal,
        closeEditModal,
        saveSetChanges,
        handleDeleteSet,
        handleDeleteExercise,
        handleDeleteWorkout
    };
}