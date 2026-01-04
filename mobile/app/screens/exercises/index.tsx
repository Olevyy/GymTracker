import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import ExerciseSelector from '@/components/exercises/ExerciseSelector';
import { Exercise } from '@/types/exercise'; 

export default function ExerciseLibraryScreen() {
  const router = useRouter();

  const handleExercisePress = (exercise: Exercise) => {
      // Navigate to exercise detail screen
      router.push(`/screens/exercises/${exercise.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-900 pb-2 bg-black">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Exercise Library</Text>
      </View>

      {/* Reusable Selector Component */}
      <ExerciseSelector onItemPress={handleExercisePress} />

    </SafeAreaView>
  );
}