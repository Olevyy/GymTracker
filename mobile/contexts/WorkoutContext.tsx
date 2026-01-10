// Context to strore active workout data globally in app
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { createWorkout, CreateWorkoutPayload } from '@/services/workoutService';
import { Exercise } from '@/types/exercise';
import { ActiveExercise } from '@/components/workout/workoutExercise'; 
import { WorkoutTemplate } from '@/services/templateService';


interface WorkoutContextType {
    workoutName: string;
    setWorkoutName: (name: string) => void;
    notes: string;
    setNotes: (notes: string) => void;
    activeExercises: ActiveExercise[];
    isSelectorVisible: boolean;
    setIsSelectorVisible: (visible: boolean) => void;
    isSubmitting: boolean;
    
    addExercise: (exercise: Exercise) => void;
    removeExercise: (exIndex: number) => void;
    addSet: (exIndex: number) => void;
    removeSet: (exIndex: number, setIndex: number) => void;
    updateSet: (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void;
    
    cancelWorkout: () => void;
    finishWorkout: () => Promise<void>;
    startWorkoutFromTemplate: (template: WorkoutTemplate) => void;
    resetWorkout: () => void; 
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    const [workoutName, setWorkoutName] = useState('New Workout');
    const [notes, setNotes] = useState('');
    const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([]);
    
    const [isSelectorVisible, setIsSelectorVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetWorkout = () => {
        setWorkoutName('New Workout');
        setNotes('');
        setActiveExercises([]);
        setIsSubmitting(false);
    };

    // EXERCISES

    const addExercise = (exercise: Exercise) => {
        const newExercise: ActiveExercise = {
            exercise: exercise,
            sets: [{ id: Date.now().toString(), weight: '', reps: '' }]
        };
        setActiveExercises(prev => [...prev, newExercise]);
        setIsSelectorVisible(false);
    };

    const removeExercise = (exIndex: number) => {
        Alert.alert("Remove Exercise", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Remove", 
                style: "destructive", 
                onPress: () => {
                    const updated = [...activeExercises];
                    updated.splice(exIndex, 1);
                    setActiveExercises(updated);
                }
            }
        ]);
    };

    // SETS

    const addSet = (exIndex: number) => {
        const updated = [...activeExercises];
        const previousSet = updated[exIndex].sets[updated[exIndex].sets.length - 1];
        
        updated[exIndex].sets.push({
            id: Date.now().toString() + Math.random(),
            weight: previousSet ? previousSet.weight : '',
            reps: previousSet ? previousSet.reps : ''
        });
        setActiveExercises(updated);
    };

    const removeSet = (exIndex: number, setIndex: number) => {
        const updated = [...activeExercises];
        updated[exIndex].sets.splice(setIndex, 1);
        setActiveExercises(updated);
    };

    const updateSet = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
        const updated = [...activeExercises];
        updated[exIndex].sets[setIndex][field] = value;
        setActiveExercises(updated);
    };

   

    const cancelWorkout = () => {
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
    };

    const startWorkoutFromTemplate = (template: WorkoutTemplate) => {
        resetWorkout();
        
        setWorkoutName(template.name);
        setNotes(template.notes || '');

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
    };

    const finishWorkout = async () => {
        if (activeExercises.length === 0) {
            Alert.alert("Empty Workout", "Add at least one exercise.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: CreateWorkoutPayload = {
                name: workoutName || "Unnamed Workout",
                notes: notes,
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
    };

    return (
        <WorkoutContext.Provider value={{
            workoutName, setWorkoutName,
            notes, setNotes,
            activeExercises,
            isSelectorVisible, setIsSelectorVisible,
            isSubmitting,
            addExercise, removeExercise,
            addSet, removeSet, updateSet,
            cancelWorkout, finishWorkout, startWorkoutFromTemplate, resetWorkout
        }}>
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
