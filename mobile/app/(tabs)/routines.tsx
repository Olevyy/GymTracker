import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function RoutinesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center">
      <Ionicons name="clipboard-outline" size={64} color="#3B82F6" />
      <Text className="text-white text-2xl font-bold mt-4">Workout Routines</Text>
      <Text className="text-gray-500 text-center mt-2 px-6">
        This is where your workout templates (e.g., Push/Pull/Legs) will live.
      </Text>
    </SafeAreaView>
  );
}