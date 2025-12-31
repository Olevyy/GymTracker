import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MyWorkoutsScreen() {

  const workouts: string | ArrayLike<any> | null | undefined = [];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4 pb-2">
        <Text className="text-white text-2xl font-bold">Workout History</Text>
      </View>

      {workouts.length === 0 ? (
        // Empty stae
        <View className="flex-1 justify-center items-center p-8 opacity-80">
          <View className="bg-gray-900 p-6 rounded-full mb-4">
            <Ionicons name="time-outline" size={64} color="#4B5563" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">Empty journal</Text>
          <Text className="text-gray-500 text-center">
            You haven't logged any workouts yet. Start training to see your workout history here!
          </Text>
        </View>
      ) : (
       // Workout list
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text className="text-white">Workout...</Text>}
        />
      )}
    </SafeAreaView>
  );
}