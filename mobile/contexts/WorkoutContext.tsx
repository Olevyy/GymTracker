// Context to strore active workout data globally in app
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { createWorkout, CreateWorkoutPayload } from '@/services/workoutService';
import { Exercise } from '@/types/exercise';
import { ActiveExercise } from '@/components/workout/workoutExercise'; 
import { WorkoutTemplate } from '@/services/templateService';
import { useWorkoutPersistence } from '@/hooks/useWorkoutPersistence';

interface WorkoutContextType {
    workoutName: string;
    setWorkoutName: (name: string) => void;
    notes: string;
    setNotes: (notes: string) => void;
    activeExercises: ActiveExercise[];
    startTime: string;
    isSelectorVisible: boolean;
    setIsSelectorVisible: (visible: boolean) => void;
    isSubmitting: boolean;
    isLoadingStorage: boolean;

    addExercise: (exercise: Exercise) => void;
    removeExercise: (exIndex: number) => void;
    addSet: (exIndex: number) => void;
    removeSet: (exIndex: number, setIndex: number) => void;
    updateSet: (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void;
    startEmptyWorkout: () => void;
    cancelWorkout: () => void;
    finishWorkout: () => Promise<void>;
    startWorkoutFromTemplate: (template: WorkoutTemplate) => void;
    resetWorkout: () => void; 
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const { loadState, saveState, clearStorage, isLoading: isLoadingStorage } = useWorkoutPersistence();
    const router = useRouter();

    const [workoutName, setWorkoutName] = useState('New Workout');
    const [notes, setNotes] = useState('');
    const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([]);
    const [startTime, setStartTime] = useState<string>(new Date().toISOString()); 

    const [isSelectorVisible, setIsSelectorVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const hydrate = async () => {
            const savedData = await loadState();
            if (savedData) {
                // If any saved workout we copy it
                setWorkoutName(savedData.workoutName);
                setNotes(savedData.notes);
                setActiveExercises(savedData.activeExercises);
                setStartTime(savedData.startTime);
            }
        };
        hydrate();
    }, []);

    useEffect(() => {
        if (isLoadingStorage) return;

        // Saving after 500 ms after each workout change
        const handler = setTimeout(() => {
            saveState({
                workoutName,
                notes,
                activeExercises,
                startTime
            });
        }, 500);

        return () => clearTimeout(handler);
    }, [workoutName, notes, activeExercises, startTime, isLoadingStorage]);

    const resetWorkout = useCallback(() => {
        setWorkoutName('New Workout');
        setNotes('');
        setActiveExercises([]);
        setStartTime(new Date().toISOString());
        setIsSubmitting(false);
        clearStorage();
    }, [clearStorage]);

    const startEmptyWorkout = useCallback(() => {
        resetWorkout(); 
    }, [resetWorkout]);

    // EXERCISES

    const addExercise = useCallback((exercise: Exercise) => {
        const newExercise: ActiveExercise = {
            exercise: exercise,
            sets: [{ id: Date.now().toString(), weight: '', reps: '' }]
        };
        setActiveExercises(prev => [...prev, newExercise]);
        setIsSelectorVisible(false);
    }, []);

    const removeExercise = useCallback((exIndex: number) => {
        Alert.alert("Remove Exercise", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Remove", 
                style: "destructive", 
                onPress: () => {
                    setActiveExercises(prev => {
                        const updated = [...prev];
                        updated.splice(exIndex, 1);
                        return updated;
                    });
                }
            }
        ]);
    }, []);

    // SETS

    const addSet = useCallback((exIndex: number) => {
        setActiveExercises(prev => {
            const updated = [...prev];
            const previousSet = updated[exIndex].sets[updated[exIndex].sets.length - 1];
            const newSets = [...updated[exIndex].sets, {
                id: Date.now().toString() + Math.random(),
                weight: previousSet ? previousSet.weight : '',
                reps: previousSet ? previousSet.reps : ''
            }];
            updated[exIndex] = { ...updated[exIndex], sets: newSets };
            return updated;
        });
    }, []);

    const removeSet = useCallback((exIndex: number, setIndex: number) => {
        setActiveExercises(prev => {
            const updated = [...prev];
            const sets = [...updated[exIndex].sets];
            sets.splice(setIndex, 1);
            updated[exIndex] = { ...updated[exIndex], sets };
            return updated;
        });
    }, []);

    const updateSet = useCallback((exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
        setActiveExercises(prev => {
            const updated = [...prev];
            const sets = [...updated[exIndex].sets];
            sets[setIndex] = { ...sets[setIndex], [field]: value };
            updated[exIndex] = { ...updated[exIndex], sets };
            return updated;
        });
    }, []);

   

    const cancelWorkout = useCallback(() => {
        Alert.alert("Cancel Workout", "Are you sure? All progress will be lost.", [
            { text: "No", style: "cancel" },
            { 
                text: "Yes, Discard", 
                style: "destructive", 
                onPress: () => {
                    resetWorkout(); 
                    router.back(); 
                }
            }
        ]);
    }, [resetWorkout, router]);

    const startWorkoutFromTemplate = useCallback((template: WorkoutTemplate) => {
        setWorkoutName(template.name);
        setNotes(template.notes || '');
        setStartTime(new Date().toISOString());
        const mappedExercises = template.exercises.map((templateEx) => ({
            exercise: {
                id: templateEx.exercise_id,
                name: templateEx.exercise_name,
                primary_muscles: [], 
                secondary_muscles: [],
                image_urls: [],
                category: null,
                level: null
            } as any, 
            sets: Array.from({ length: templateEx.sets_count }).map((_, i) => ({
                id: Date.now().toString() + i + Math.random(),
                weight: '',
                reps: '' 
            }))
        }));

        setActiveExercises(mappedExercises);
    }, []);

    const finishWorkout = useCallback(async () => {
        if (activeExercises.length === 0) {
            Alert.alert("Empty Workout", "Add at least one exercise.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: CreateWorkoutPayload = {
                name: workoutName || "Unnamed Workout",
                notes: notes,
                start_time: new Date().toISOString(),
                exercises: activeExercises.map((ex, exIndex) => ({
                    exercise_id: ex.exercise.id,
                    order: exIndex + 1,
                    sets: ex.sets
                        .filter(s => s.weight && s.reps)
                        .map((s, sIndex) => ({
                            weight: parseFloat(s.weight),
                            reps: parseInt(s.reps),
                            order: sIndex + 1
                        }))
                })).filter(ex => ex.sets.length > 0)
            };

            if (payload.exercises.length === 0) {
                Alert.alert("Incomplete Data", "Please fill in weight and reps.");
                setIsSubmitting(false);
                return;
            }

            await createWorkout(payload);
            
            Alert.alert("Success", "Workout saved!", [
                { 
                    text: "OK", 
                    onPress: () => {
                        resetWorkout(); 
                        router.replace('/(tabs)/my-workouts');
                    } 
                }
            ]);

        } catch (error: any) {
            Alert.alert("Error", error.message || "Could not save workout");
        } finally {
            setIsSubmitting(false);
        }
    }, [activeExercises, workoutName, notes, router]);

    const value = useMemo(() => ({
        workoutName,
        setWorkoutName,
        notes,
        setNotes,
        activeExercises,
        startTime,
        isSelectorVisible,
        setIsSelectorVisible,
        isSubmitting,
        isLoadingStorage,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
        updateSet,
        cancelWorkout,
        finishWorkout,
        startWorkoutFromTemplate,
        startEmptyWorkout,
        resetWorkout
    }), [
        workoutName,
        setWorkoutName,
        notes,
        setNotes,
        activeExercises,
        startTime,
        isSelectorVisible,
        setIsSelectorVisible,
        isSubmitting,
        isLoadingStorage,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
        updateSet,
        cancelWorkout,
        finishWorkout,
        startWorkoutFromTemplate,
        startEmptyWorkout,
        resetWorkout
    ]);

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useActiveWorkout() {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useActiveWorkout must be used within a WorkoutProvider');
    }
    return context;
}
