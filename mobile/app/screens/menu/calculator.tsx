import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { calculateOneRepMax } from '@/utils/calculations';


const CalcInput = ({ value, onChangeText, label, placeholder }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View className="flex-1 mx-2">
            <Text className="text-gray-500 font-bold mb-2 text-xs uppercase tracking-wider">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={isFocused ? '' : placeholder}
                placeholderTextColor="#374151"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType={isFocused ? 'numeric' : 'default'}
                textAlign="center"
                className={`bg-gray-900 text-white text-center h-16 rounded-2xl font-bold text-3xl border ${isFocused ? 'border-blue-500' : 'border-gray-800'}`}
                style={{ textAlign: 'center' }}
                selectionColor="#3B82F6"
            />
        </View>
    );
};

export default function OneRepMaxScreen() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');


    const oneRMString = calculateOneRepMax(weight, reps);
    const oneRM = oneRMString !== '-' ? parseInt(oneRMString) : 0;

    const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

    return (
        <SafeAreaView className="flex-1 bg-black">
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-900">
                <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-900 rounded-full mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">1RM Calculator</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                
                {/* Inputs Section */}
                <View className="flex-row justify-between mb-8 mt-2">
                    <CalcInput 
                        label="Weight (kg)" 
                        value={weight} 
                        onChangeText={setWeight} 
                        placeholder="100" 
                    />
                    <CalcInput 
                        label="Reps" 
                        value={reps} 
                        onChangeText={setReps} 
                        placeholder="5" 
                    />
                </View>

                {/* Main Result */}
                <View className="items-center justify-center bg-gray-900/50 p-8 rounded-3xl border border-gray-800 mb-8">
                    <Text className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">
                        Estimated One Rep Max
                    </Text>
                    <View className="flex-row items-end">
                        <Text className="text-blue-500 text-7xl font-bold">
                            {oneRM > 0 ? oneRM : '-'}
                        </Text>
                        <Text className="text-gray-500 text-2xl font-bold mb-2 ml-2">kg</Text>
                    </View>
                </View>

                {/* Percentages Table */}
                {oneRM > 0 && (
                    <View className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 mb-10">
                        <View className="p-4 bg-gray-800/50 border-b border-gray-800">
                            <Text className="text-white font-bold text-lg">Training Percentages</Text>
                        </View>
                        
                        {percentages.map((percent, index) => (
                            <View 
                                key={percent} 
                                className={`flex-row justify-between p-4 border-gray-800 ${index !== percentages.length - 1 ? 'border-b' : ''}`}
                            >
                                <View className="flex-row items-center">
                                    <View className={`w-2 h-2 rounded-full mr-3 ${percent >= 85 ? 'bg-red-500' : percent >= 70 ? 'bg-blue-500' : 'bg-green-500'}`} />
                                    <Text className="text-gray-300 font-bold text-base">{percent}%</Text>
                                    <Text className="text-gray-600 text-xs ml-2">
                                        {percent >= 85 ? '(Strength)' : percent >= 70 ? '(Hypertrophy)' : '(Endurance)'}
                                    </Text>
                                </View>
                                <Text className="text-white font-bold text-lg">
                                    {Math.round(oneRM * (percent / 100))} kg
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}