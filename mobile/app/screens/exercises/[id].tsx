import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getExerciseById } from '@/services/exercisesService';
import { Exercise } from '@/types/exercise';

const { width } = Dimensions.get('window');

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      if (typeof id === 'string') {
        const data = await getExerciseById(id);
        setExercise(data);
      }
    } catch (err) {
      setError('Could not load exercise details.');
    } finally {
      setLoading(false);
    }
  };

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

  // Badge component for displaying info
  const InfoBadge = ({ label, value, color = "text-gray-300" }: any) => (
    <View className="bg-gray-900 px-3 py-2 rounded-lg border border-gray-800 flex-1 mr-2 items-center">
        <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">{label}</Text>
        <Text className={`font-bold capitalize text-center ${color}`}>{value || '-'}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['bottom']}> 
      {/* Hiding default header */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 1. IMAGE CAROUSEL */}
        <View className="relative h-72 w-full bg-white">
            {/* Custom Back Button overlay */}
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
                            style={{ width: width, height: 288 }} // 288 = h-72
                            resizeMode="contain"
                        />
                    ))
                ) : (
                    <View style={{ width: width, height: 288 }} className="items-center justify-center bg-gray-900">
                        <Ionicons name="image-outline" size={64} color="#4B5563" />
                        <Text className="text-gray-500 mt-2">No image available</Text>
                    </View>
                )}
            </ScrollView>
        </View>

        {/* 2. HEADER INFO */}
        <View className="px-5 pt-6">
            <Text className="text-white text-3xl font-bold mb-1">{exercise.name}</Text>
            <Text className="text-blue-500 text-lg capitalize font-medium mb-6">
                {exercise.category}
            </Text>

            {/* Grid of basic stats */}
            <View className="flex-row mb-6">
                <InfoBadge label="Level" value={exercise.level} color="text-yellow-400" />
                <InfoBadge label="Mechanic" value={exercise.mechanic} />
                <InfoBadge label="Force" value={exercise.force} />
            </View>

            {/* Equipment Info */}
            <View className="flex-row items-center mb-6 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                <Ionicons name="barbell-outline" size={24} color="#9CA3AF" />
                <Text className="text-gray-400 ml-2">Equipment:</Text>
                <Text className="text-white font-bold ml-2 capitalize">
                    {exercise.equipment || 'None'}
                </Text>
            </View>
        </View>

        <View className="h-px bg-gray-900 my-2 mx-5" />

        {/* 3. MUSCLES */}
        <View className="px-5 py-4">
            <Text className="text-white text-xl font-bold mb-3">Muscles</Text>
            
            {/* Primary */}
            <View className="mb-4">
                <Text className="text-blue-400 text-sm font-bold uppercase mb-2">Target (Primary)</Text>
                <View className="flex-row flex-wrap">
                    {exercise.primary_muscles.map((m, i) => (
                        <View key={i} className="bg-blue-600 px-3 py-1.5 rounded-full mr-2 mb-2">
                            <Text className="text-white font-bold capitalize">{m}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Secondary */}
            {exercise.secondary_muscles.length > 0 && (
                <View>
                    <Text className="text-gray-500 text-sm font-bold uppercase mb-2">Synergists (Secondary)</Text>
                    <View className="flex-row flex-wrap">
                        {exercise.secondary_muscles.map((m, i) => (
                            <View key={i} className="bg-gray-800 px-3 py-1.5 rounded-full mr-2 mb-2 border border-gray-700">
                                <Text className="text-gray-300 text-xs capitalize">{m}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>

        <View className="h-px bg-gray-900 my-2 mx-5" />

        {/* 4. INSTRUCTIONS */}
        {exercise.instructions && exercise.instructions.length > 0 && (
            <View className="px-5 py-4">
                <Text className="text-white text-xl font-bold mb-4">Instructions</Text>
                {exercise.instructions.map((step, index) => (
                    <View key={index} className="flex-row mb-4">
                        <View className="bg-gray-800 w-6 h-6 rounded-full items-center justify-center mt-0.5 mr-3">
                            <Text className="text-blue-400 font-bold text-xs">{index + 1}</Text>
                        </View>
                        <Text className="text-gray-300 text-base flex-1 leading-6">
                            {step}
                        </Text>
                    </View>
                ))}
            </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}