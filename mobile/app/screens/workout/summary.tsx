// View for displaying workout summary after completion
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutSummaryResponse } from '@/services/workoutService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveWorkout } from '@/contexts/WorkoutContext';
export default function WorkoutSummaryScreen() {
    const router = useRouter();

    const { lastWorkoutSummary, clearSummary } = useActiveWorkout();



    const handleGoHome = () => {
        clearSummary();
        router.dismissAll(); 
        router.replace('/'); 
    };

    if (!lastWorkoutSummary) { 
        return (
            <SafeAreaView className="flex-1 bg-black justify-center items-center">
                <Text className="text-white">No summary data available.</Text>
                <TouchableOpacity onPress={handleGoHome} className="mt-4">
                    <Text className="text-blue-500">Go Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { total_volume, new_records } = lastWorkoutSummary;
    
    const hasRecords = new_records.length > 0;

    return (
        <SafeAreaView className="flex-1 bg-black">
        <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
            
            {/* 1. SUCCESS ICON */}
            <View className="mt-8 mb-6 bg-green-900/20 p-6 rounded-full border border-green-500/30">
                <Ionicons name="checkmark-done" size={64} color="#4ade80" />
            </View>

            <Text className="text-white text-3xl font-bold mb-2 text-center">
                Workout Completed!
            </Text>
            <Text className="text-gray-400 text-base mb-10 text-center">
                Great job pushing your limits today.
            </Text>

            {/* 2. MAIN STATS CARD */}
            <View className="w-full bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6 flex-row items-center justify-between">
                <View>
                    <Text className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Volume</Text>
                    <Text className="text-white text-3xl font-bold mt-1">
                        {total_volume >= 1000 
                            ? `${(total_volume / 1000).toFixed(1)}k` 
                            : total_volume} 
                        <Text className="text-lg text-gray-500 font-normal"> kg</Text>
                    </Text>
                </View>
                <View className="bg-blue-900/20 p-3 rounded-full">
                        <Ionicons name="barbell" size={32} color="#3B82F6" />
                </View>
            </View>

            {/* 3. NEW RECORDS SECTION (Conditional) */}
            {hasRecords && (
                <View className="w-full mb-8">
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="trophy" size={20} color="#FBBF24" />
                        <Text className="text-yellow-400 font-bold text-lg ml-2">New Records!</Text>
                    </View>

                    {new_records.map((record, index) => {
                        const improvement = record.old_1rm 
                            ? (record.new_1rm - record.old_1rm).toFixed(1) 
                            : record.new_1rm;
                        
                        const isFirstTime = !record.old_1rm;

                        return (
                            <View 
                                key={index} 
                                className="bg-yellow-900/10 border border-yellow-700/30 p-4 rounded-xl mb-3"
                            >
                                <Text className="text-white font-bold text-lg mb-1">
                                    {record.exercise_name}
                                </Text>
                                
                                <View className="flex-row justify-between items-end">
                                    <View>
                                        <Text className="text-gray-400 text-xs">Estimated 1RM</Text>
                                        <Text className="text-yellow-400 text-2xl font-bold">
                                            {record.new_1rm} kg
                                        </Text>
                                    </View>
                                    
                                    {/* Improvement Badge */}
                                    <View className="bg-yellow-500/20 px-3 py-1 rounded-lg">
                                        <Text className="text-yellow-300 font-bold text-xs">
                                            {isFirstTime ? 'NEW MAX' : `+${improvement} kg`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

        </ScrollView>

        {/* 4. FOOTER BUTTON */}
        <View className="p-4 border-t border-gray-900">
            <TouchableOpacity 
                onPress={handleGoHome}
                className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-lg shadow-blue-900/50"
            >
                <Text className="text-white font-bold text-lg">Finish & Go Home</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}