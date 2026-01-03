// Detailed view about exercise from db
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '@/types/exercise';

interface Props {
    exercise: Exercise;
}

const InfoBadge = ({ label, value, color = "text-gray-300" }: any) => (
    <View className="bg-gray-900 px-3 py-2 rounded-lg border border-gray-800 flex-1 mr-2 items-center">
        <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">{label}</Text>
        <Text className={`font-bold capitalize text-center ${color}`}>{value || '-'}</Text>
    </View>
);

export default function ExerciseAboutTab({ exercise }: Props) {
  return (
    <View className="px-5 py-4">
        {/* Basic Stats Grid */}
        <View className="flex-row mb-6">
            <InfoBadge label="Level" value={exercise.level} color="text-yellow-400" />
            <InfoBadge label="Mechanic" value={exercise.mechanic} />
            <InfoBadge label="Force" value={exercise.force} />
        </View>

        {/* Equipment */}
        <View className="flex-row items-center mb-6 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
            <Ionicons name="barbell-outline" size={24} color="#9CA3AF" />
            <Text className="text-gray-400 ml-2">Equipment:</Text>
            <Text className="text-white font-bold ml-2 capitalize">
                {exercise.equipment || 'None'}
            </Text>
        </View>

        <View className="h-px bg-gray-900 my-2" />

        {/* Muscles */}
        <View className="py-4">
            <Text className="text-white text-xl font-bold mb-3">Muscles</Text>
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

        <View className="h-px bg-gray-900 my-2" />

        {/* Instructions */}
        {exercise.instructions && exercise.instructions.length > 0 && (
            <View className="py-4">
                <Text className="text-white text-xl font-bold mb-4">Instructions</Text>
                {exercise.instructions.map((step, index) => (
                    <View key={index} className="flex-row mb-4">
                        <View className="bg-gray-800 w-6 h-6 rounded-full items-center justify-center mt-0.5 mr-3">
                            <Text className="text-blue-400 font-bold text-xs">{index + 1}</Text>
                        </View>
                        <Text className="text-gray-300 text-base flex-1 leading-6">{step}</Text>
                    </View>
                ))}
            </View>
        )}
    </View>
  );
}