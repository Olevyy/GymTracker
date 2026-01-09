// Select and load as context exercises from current workout
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTemplates } from '@/hooks/useTemplate';
import { useActiveWorkout } from '@/contexts/WorkoutContext';
import { WorkoutTemplate } from '@/services/templateService';

export default function TemplateSelectorScreen() {
    const router = useRouter();
    const { templates, loading } = useTemplates();
    const { startWorkoutFromTemplate } = useActiveWorkout(); 

    const handleSelect = (template: WorkoutTemplate) => {
        startWorkoutFromTemplate(template);
        router.replace('/screens/workout/');
    };

    const renderItem = ({ item }: { item: WorkoutTemplate }) => (
        <TouchableOpacity 
            onPress={() => handleSelect(item)}
            className="bg-gray-900 rounded-xl mb-3 p-4 border border-gray-800 flex-row justify-between items-center"
        >
            <View className="flex-1 mr-4">
                <Text className="text-white text-lg font-bold">{item.name}</Text>
                <Text className="text-gray-500 text-xs mt-1">
                    {item.exercises.length} exercises {item.notes && '• Has notes'}
                </Text>
                
                {/* exercises */}
                <View className="flex-row flex-wrap mt-2">
                    {item.exercises.slice(0, 3).map((ex, i) => (
                        <Text key={i} className="text-gray-500 text-[10px] mr-2 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                            {ex.exercise_name}
                        </Text>
                    ))}
                    {item.exercises.length > 3 && (
                        <Text className="text-gray-600 text-[10px] self-center">...</Text>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#3B82F6" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-900 mb-2">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Select Routine</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={templates}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <View className="mt-20 items-center opacity-70">
                            <Ionicons name="clipboard-outline" size={48} color="#4B5563" />
                            <Text className="text-gray-500 mt-4">No routines found.</Text>
                            <TouchableOpacity onPress={() => router.push('/screens/templates/create')} className="mt-2">
                                <Text className="text-blue-500 font-bold">Create new routine</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}