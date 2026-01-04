// When exercise pressed - detailed view and hisory
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useExerciseData } from '@/hooks/useExerciseData';
import ExerciseAboutTab from '@/components/exercises/ExerciseAboutTab';
import ExerciseHistoryTab from '@/components/exercises/ExcerciseHistoryTab';

const { width } = Dimensions.get('window');

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  
  // Custom Hook fetches everything
  const { exercise, history, records, loading, error } = useExerciseData(id as string);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'about' | 'history'>('about');

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500 mb-4">{error || 'Exercise not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-800 px-4 py-2 rounded-lg">
           <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['bottom']}> 
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} stickyHeaderIndices={[2]}> 
        
        {/* IMAGE CAROUSEL */}
        <View className="relative h-72 w-full bg-white">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="absolute top-12 left-4 z-10 bg-black/50 p-2 rounded-full"
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {exercise.image_urls && exercise.image_urls.length > 0 ? (
                    exercise.image_urls.map((url, index) => (
                        <Image 
                            key={index}
                            source={{ uri: url }}
                            style={{ width: width, height: 288 }} 
                            resizeMode="contain"
                        />
                    ))
                ) : (
                    <View style={{ width: width, height: 288 }} className="items-center justify-center bg-gray-900">
                        <Ionicons name="image-outline" size={64} color="#4B5563" />
                    </View>
                )}
            </ScrollView>
        </View>

        {/*HEADER INFO (Name & Category) */}
        <View className="px-5 pt-6 pb-2 bg-black">
            <Text className="text-white text-3xl font-bold mb-1">{exercise.name}</Text>
            <Text className="text-blue-500 text-lg capitalize font-medium">{exercise.category}</Text>
        </View>

        {/* TABS SWITCHER (Sticky) */}
        <View className="flex-row px-5 pt-2 pb-2 bg-black border-b border-gray-900 mb-2">
            <TouchableOpacity 
                onPress={() => setActiveTab('about')}
                className={`flex-1 pb-3 border-b-2 ${activeTab === 'about' ? 'border-blue-500' : 'border-transparent'}`}
            >
                <Text className={`text-center font-bold ${activeTab === 'about' ? 'text-blue-500' : 'text-gray-500'}`}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => setActiveTab('history')}
                className={`flex-1 pb-3 border-b-2 ${activeTab === 'history' ? 'border-blue-500' : 'border-transparent'}`}
            >
                <Text className={`text-center font-bold ${activeTab === 'history' ? 'text-blue-500' : 'text-gray-500'}`}>History & Stats</Text>
            </TouchableOpacity>
        </View>

        {/* CONTENT */}
        {activeTab === 'about' ? (
            <ExerciseAboutTab exercise={exercise} />
        ) : (
            <ExerciseHistoryTab history={history} records={records} />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}