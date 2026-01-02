// Detailed Workout View - deletes modify sets
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutDetail } from '@/hooks/useWorkoutDetail'; 

export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const {
        workout, loading,
        editingSet, editWeight, setEditWeight, editReps, setEditReps, isSaving,
        openEditModal, closeEditModal, saveSetChanges,
        handleDeleteSet, handleDeleteExercise, handleDeleteWorkout
    } = useWorkoutDetail(id as string);

    if (loading || !workout) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator color="#3B82F6" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            
            {/* --- HEADER --- */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-900 bg-black">
            <View className="flex-row items-center flex-1 mr-2">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-white text-xl font-bold" numberOfLines={1}>
                        {workout.name}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                        {new Date(workout.start_time).toLocaleString()}
                    </Text>
                </View>
            </View>
            <TouchableOpacity 
                onPress={handleDeleteWorkout}
                className="p-2 bg-red-900/20 rounded-lg border border-red-900/50"
            >
                <Ionicons name="trash" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
        {/* Notes */}
        {workout.notes ? (
            <View className="bg-gray-900 p-4 rounded-xl mb-4 border border-gray-800">
                <Text className="text-gray-400 italic">"{workout.notes}"</Text>
            </View>
        ) : null}

        {/* Exercises List */}
        {workout.exercises.map((item) => (
            <View key={item.id} className="bg-gray-900 mb-4 rounded-xl overflow-hidden border border-gray-800">
                
            {/* Exercise Header */}
            <View className="flex-row justify-between items-center p-3 bg-gray-800/50">
                <View className="flex-row items-center flex-1">
                    {item.exercise_details.image_urls?.[0] ? (
                        <Image source={{ uri: item.exercise_details.image_urls[0] }} className="w-10 h-10 rounded-full bg-white mr-3" resizeMode="cover"/>
                    ) : (
                        <View className="w-10 h-10 rounded-full bg-gray-700 mr-3 items-center justify-center"><Ionicons name="barbell" size={16} color="white" /></View>
                    )}
                    <Text className="text-white font-bold text-lg flex-1">{item.exercise_details.name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteExercise(item.id)} className="p-2">
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View className="flex-row px-4 py-2 border-b border-gray-800">
                <Text className="text-gray-500 text-xs font-bold w-10 text-center">SET</Text>
                <Text className="text-gray-500 text-xs font-bold flex-1 text-center">KG</Text>
                <Text className="text-gray-500 text-xs font-bold flex-1 text-center">REPS</Text>
                <Text className="text-gray-500 text-xs font-bold flex-1 text-center">1RM</Text>
            </View>

            {/* Sets Rows */}
            {item.sets.map((set, index) => (
                <TouchableOpacity 
                    key={set.id} 
                    onPress={() => openEditModal(set)} // Używamy funkcji z hooka
                    className="flex-row px-4 py-3 border-b border-gray-800/50 active:bg-gray-800"
                >
                    <View className="w-10 items-center justify-center bg-gray-800 h-6 rounded">
                        <Text className="text-gray-400 text-xs font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-white font-bold flex-1 text-center text-base">
                        {parseFloat(set.weight)}
                    </Text>
                    <Text className="text-white font-bold flex-1 text-center text-base">
                        {set.reps}
                    </Text>
                    <Text className="text-gray-500 flex-1 text-center text-sm mt-0.5">
                        {set.one_rep_max}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
        ))}
        <View className="h-10"/>
        </ScrollView>

            {/* Edit sets */}
        <Modal
            visible={!!editingSet}
            transparent
            animationType="fade"
            onRequestClose={closeEditModal}
        >
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-gray-900 w-full max-w-sm p-6 rounded-2xl border border-gray-700">
        <Text className="text-white text-xl font-bold mb-4 text-center">Edit Set</Text>

        <View className="flex-row justify-between mb-6">
            <View className="flex-1 mr-2">
                <Text className="text-gray-400 text-xs mb-1 ml-1">Weight (kg)</Text>
                <TextInput 
                    className="bg-black text-white p-4 rounded-xl text-center font-bold text-xl border border-gray-700"
                    keyboardType="numeric"
                    value={editWeight}
                    onChangeText={setEditWeight}
                    selectionColor="#3B82F6"
                />
            </View>
            <View className="flex-1 ml-2">
                <Text className="text-gray-400 text-xs mb-1 ml-1">Reps</Text>
                <TextInput 
                    className="bg-black text-white p-4 rounded-xl text-center font-bold text-xl border border-gray-700"
                    keyboardType="numeric"
                    value={editReps}
                    onChangeText={setEditReps}
                    selectionColor="#3B82F6"
                />
            </View>
        </View>

        <View className="flex-row justify-between">
            <TouchableOpacity 
                onPress={handleDeleteSet}
                className="bg-red-900/30 p-4 rounded-xl flex-1 mr-2 items-center border border-red-900/50"
            >
                <Text className="text-red-400 font-bold">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={saveSetChanges}
                disabled={isSaving}
                className="bg-blue-600 p-4 rounded-xl flex-[2] ml-2 items-center"
            >
                {isSaving ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold">Save Changes</Text>
                )}
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={closeEditModal} className="mt-4 py-2">
            <Text className="text-gray-500 text-center">Cancel</Text>
        </TouchableOpacity>
        </View>
        </View>
        </Modal>
        </SafeAreaView>
    );
}