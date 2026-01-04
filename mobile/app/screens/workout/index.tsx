// Main screen presented during workout
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ExerciseSelector from '@/components/exercises/ExerciseSelector';
import ActiveExerciseCard from '@/components/workout/workoutExercise';
import { useActiveWorkout } from '@/hooks/useWorkout'; 

export default function ActiveWorkoutScreen() {
  const {
    workoutName, setWorkoutName,
    notes, setNotes,
    activeExercises,
    isSelectorVisible, setIsSelectorVisible,
    isSubmitting,
    addExercise, removeExercise,
    addSet, removeSet, updateSet,
    cancelWorkout, finishWorkout
  } = useActiveWorkout();

  return (
    <SafeAreaView className="flex-1 bg-black">
        {/* HEADER */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-900">
            <TouchableOpacity onPress={cancelWorkout}>
                <Text className="text-red-500 text-lg">Cancel</Text>
            </TouchableOpacity>
            
            <Text className="text-white text-lg font-bold">Active Workout</Text>
            
            <TouchableOpacity onPress={finishWorkout} disabled={isSubmitting}>
                {isSubmitting ? (
                    <ActivityIndicator color="#3B82F6" />
                ) : (
                    <Text className="text-blue-500 text-lg font-bold">Finish</Text>
                )}
            </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
            {/* INPUTS */}
            <TextInput 
                className="text-white text-2xl font-bold mb-4 border-b border-gray-800 pb-2"
                placeholder="Workout Name"
                placeholderTextColor="#6B7280"
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            
            <TextInput 
                className="text-gray-300 text-base mb-6 bg-gray-900 p-3 rounded-lg min-h-[80px]"
                placeholder="Add notes here..."
                placeholderTextColor="#6B7280"
                multiline
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
            />

            {/* LIST */}
            {activeExercises.map((item, index) => (
                <ActiveExerciseCard 
                    key={index}
                    item={item}
                    exerciseIndex={index}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onRemoveSet={removeSet}
                    onRemoveExercise={removeExercise}
                />
            ))}

            {/* ADD BUTTON */}
            <TouchableOpacity 
                onPress={() => setIsSelectorVisible(true)}
                className="bg-blue-600 p-4 rounded-xl items-center justify-center mb-10 mt-2"
            >
                <Text className="text-white font-bold text-lg">Add Exercise</Text>
            </TouchableOpacity>
        </ScrollView>

        {/* Exercise selector */}
        <Modal 
            visible={isSelectorVisible} 
            animationType="slide" 
            presentationStyle="pageSheet"
        >
            <SafeAreaView className="flex-1 bg-black">
                <View className="flex-row items-center p-4 border-b border-gray-900">
                     <TouchableOpacity onPress={() => setIsSelectorVisible(false)} className="mr-4">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Select Exercise</Text>
                </View>
                
                <ExerciseSelector onItemPress={addExercise} />
                
            </SafeAreaView>
        </Modal>

    </SafeAreaView>
  );
}