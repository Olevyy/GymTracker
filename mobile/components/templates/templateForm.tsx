import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExerciseSelector from '@/components/exercises/ExerciseSelector';
import { Exercise } from '@/types/exercise';

interface TemplateFormProps {
    initialName?: string;
    initialNotes?: string;
    initialExercises?: any[]; 
    onSubmit: (data: any) => Promise<void>;
    submitLabel: string;
    onCancel: () => void;
}

export default function TemplateForm({ 
    initialName = '', 
    initialNotes = '', 
    initialExercises = [], 
    onSubmit, 
    submitLabel,
    onCancel
}: TemplateFormProps) {
    
    const [name, setName] = useState(initialName);
    const [notes, setNotes] = useState(initialNotes);
    const [items, setItems] = useState<any[]>(initialExercises);
    
    const [isSelectorVisible, setIsSelectorVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddExercise = (exercise: Exercise) => {
        setItems(prev => [...prev, { exercise, sets_count: 3 }]);
        setIsSelectorVisible(false);
    };

    const handleRemoveExercise = (indexToRemove: number) => {
        setItems(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const updateSets = (index: number, change: number) => {
        setItems(prev => {
            const newItems = [...prev];
            const current = newItems[index].sets_count;
            if (current + change >= 1) {
                newItems[index].sets_count = current + change;
            }
            return newItems;
        });
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert("Missing Info", "Please enter a routine name.");
            return;
        }
        if (items.length === 0) {
            Alert.alert("Empty Routine", "Please add at least one exercise.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name,
                notes,
                exercises: items.map((item, index) => ({
                    exercise_id: item.exercise.id,
                    order: index + 1,
                    sets_count: item.sets_count
                }))
            };
            await onSubmit(payload);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
             {/* Header */}
             <View className="flex-row justify-between items-center p-4 border-b border-gray-900 bg-black">
                <TouchableOpacity onPress={onCancel}>
                    <Text className="text-red-500 text-lg">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">{submitLabel === 'Save' ? 'New Routine' : 'Edit Routine'}</Text>
                <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <ActivityIndicator color="#3B82F6" />
                    ) : (
                        <Text className="text-blue-500 text-lg font-bold">{submitLabel}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-gray-500 text-xs font-bold uppercase mb-1 ml-1">Routine Details</Text>
                    <TextInput 
                        className="text-white text-xl font-bold bg-gray-900 p-3 rounded-t-xl border-b border-gray-800"
                        placeholder="Name (e.g. Push Day)"
                        placeholderTextColor="#6B7280"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput 
                        className="text-gray-300 text-base bg-gray-900 p-3 rounded-b-xl min-h-[60px]"
                        placeholder="Notes (optional)..."
                        placeholderTextColor="#6B7280"
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                <Text className="text-gray-500 text-xs font-bold uppercase mb-2 ml-1">Exercises</Text>
                
                {items.map((item, index) => (
                    <View key={index} className="bg-gray-900 mb-3 rounded-xl p-3 border border-gray-800 flex-row items-center justify-between">
                        <View className="flex-1 mr-2">
                            <Text className="text-white font-bold text-base" numberOfLines={1}>
                                {item.exercise.name}
                            </Text>
                            {item.exercise.primary_muscles && (
                                <Text className="text-gray-500 text-xs">
                                    {item.exercise.primary_muscles.join(', ')}
                                </Text>
                            )}
                        </View>
                        
                        <View className="flex-row items-center bg-gray-800 rounded-lg mr-3">
                            <TouchableOpacity onPress={() => updateSets(index, -1)} className="p-2">
                                <Ionicons name="remove" size={16} color="white" />
                            </TouchableOpacity>
                            <View className="w-8 items-center">
                                <Text className="text-white font-bold">{item.sets_count}</Text>
                                <Text className="text-gray-500 text-[8px]">SETS</Text>
                            </View>
                            <TouchableOpacity onPress={() => updateSets(index, 1)} className="p-2">
                                <Ionicons name="add" size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity 
                    onPress={() => setIsSelectorVisible(true)}
                    className="bg-gray-800 border border-gray-700 p-4 rounded-xl items-center justify-center mt-2 border-dashed mb-10"
                >
                    <View className="flex-row items-center">
                        <Ionicons name="add-circle" size={24} color="#3B82F6" />
                        <Text className="text-blue-500 font-bold text-lg ml-2">Add Exercise</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={isSelectorVisible} animationType="slide" presentationStyle="pageSheet">
                <View className="flex-1 bg-black pt-4">
                     <View className="flex-row items-center p-4 border-b border-gray-900">
                        <TouchableOpacity onPress={() => setIsSelectorVisible(false)} className="mr-4">
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-xl font-bold">Select Exercise</Text>
                    </View>
                    <ExerciseSelector onItemPress={handleAddExercise} />
                </View>
            </Modal>
        </View>
    );
}