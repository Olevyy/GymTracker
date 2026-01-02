// Single Exercise within Workout - sets, reps
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { Exercise } from '@/types/exercise';

export interface ActiveSet {
    id: string;
    weight: string;
    reps: string;
}

export interface ActiveExercise {
    exercise: Exercise;
    sets: ActiveSet[];
}

interface Props {
    item: ActiveExercise;
    exerciseIndex: number;
    onUpdateSet: (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void;
    onAddSet: (exIndex: number) => void;
    onRemoveSet: (exIndex: number, setIndex: number) => void;
    onRemoveExercise: (exIndex: number) => void;
}

const SetInput = ({ 
    value, 
    onChangeText, 
    placeholder, 
    ...props 
}: TextInputProps & { value: string, onChangeText: (text: string) => void }) => {
    
    const [isFocused, setIsFocused] = useState(false);

    return (
        <TextInput
            {...props}
            value={value}
            onChangeText={onChangeText}
            placeholder={isFocused ? '' : placeholder} 
            placeholderTextColor="#374151"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            
            className="bg-black text-white text-center h-12 rounded font-bold text-xl w-full" 
            style={{ paddingVertical: 0 }}
            selectionColor="#3B82F6"
            textAlign="center"
            textAlignVertical="center"
            keyboardType="numeric"
        />
    );
};


export default function ActiveExerciseCard({ item, exerciseIndex, onUpdateSet, onAddSet, onRemoveSet, onRemoveExercise }: Props) {
  const router = useRouter(); 


  const goToDetails = () => {
      // Detailed view
      router.push(`/screens/exercises/${item.exercise.id}`);
  };

  return (
    <View className="bg-gray-900 mb-4 rounded-xl p-4 border border-gray-800">
      
      {/* Header - clickable */}
      <View className="flex-row justify-between items-center mb-4">
        
        <TouchableOpacity 
            onPress={goToDetails}
            className="flex-1 flex-row items-center mr-2"
            activeOpacity={0.7}
        >
            <Text className="text-white text-lg font-bold mr-2 shrink" numberOfLines={1}>
                {item.exercise.name}
            </Text>
            <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
        </TouchableOpacity>

        {/* Button to remove exercise */}
        <TouchableOpacity onPress={() => onRemoveExercise(exerciseIndex)} className="p-1">
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Helper info */}
      <View className="flex-row mb-2 px-2">
        <Text className="text-gray-500 text-xs font-bold w-8 text-center">SET</Text>
        <Text className="text-gray-500 text-xs font-bold flex-1 text-center">WEIGHT (KG)</Text>
        <Text className="text-gray-500 text-xs font-bold flex-1 text-center">REPS</Text>
        <View className="w-8" />
      </View>

      {/* List of sets*/}
      {item.sets.map((set, setIndex) => (
        <View key={set.id} className="flex-row items-center mb-2 bg-gray-800/50 rounded-lg p-1">
            
            {/* NO*/}
            <View className="w-8 items-center justify-center bg-gray-800 h-12 rounded">
                <Text className="text-gray-400 font-bold text-sm">{setIndex + 1}</Text>
            </View>

            {/* Weight (KG) */}
            <View className="flex-1 px-2">
                <SetInput
                    value={set.weight}
                    onChangeText={(text) => onUpdateSet(exerciseIndex, setIndex, 'weight', text)}
                    placeholder="-"
                />
            </View>

            {/* (REPS) */}
            <View className="flex-1 px-2">
                <SetInput
                    value={set.reps}
                    onChangeText={(text) => onUpdateSet(exerciseIndex, setIndex, 'reps', text)}
                    placeholder="-"
                />
            </View>

            {/* Remove */}
            <TouchableOpacity 
                onPress={() => onRemoveSet(exerciseIndex, setIndex)} 
                className="w-8 items-center justify-center h-12"
            >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity 
        onPress={() => onAddSet(exerciseIndex)} 
        className="mt-2 bg-blue-900/20 py-3 rounded-lg flex-row justify-center items-center border border-blue-900/50 active:bg-blue-900/30"
      >
        <Ionicons name="add" size={16} color="#60A5FA" />
        <Text className="text-blue-400 font-bold ml-2 text-sm">Add Set</Text>
      </TouchableOpacity>
      
    </View>
  );
}