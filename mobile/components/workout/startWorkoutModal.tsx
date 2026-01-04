// Custom Modal to choose Empty training or from Template
import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    visible: boolean;
    onClose: () => void;
    onStartEmpty: () => void;
    onStartTemplate: () => void;
}

export default function StartWorkoutModal({ visible, onClose, onStartEmpty, onStartTemplate }: Props) {
    
    const OptionCard = ({ title, subtitle, icon, color, onPress }: any) => (
        <TouchableOpacity 
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-gray-800/50 p-5 rounded-2xl mb-4 border border-gray-700"
        >
            {/* Icon */}
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                <Ionicons 
                    name={icon} 
                    size={24} 
                    color={color === 'blue' ? '#60A5FA' : '#A78BFA'} 
                />
            </View>
            
            {/* Text */}
            <View className="flex-1">
                <Text className="text-white text-lg font-bold">{title}</Text>
                <Text className="text-gray-400 text-sm">{subtitle}</Text>
            </View>

            {/* Arrow*/}
            <Ionicons name="chevron-forward" size={20} color="#4B5563" />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* Smart closing modal */}
        <TouchableWithoutFeedback onPress={onClose}>
            <View className="flex-1 bg-black/80 justify-end">
                
            <TouchableWithoutFeedback>
            <View className="bg-[#1C1C1E] rounded-t-3xl p-6 pb-10 border-t border-gray-800">
                
                {/* HandleBar" */}
                <View className="items-center mb-6">
                    <View className="w-12 h-1.5 bg-gray-600 rounded-full" />
                </View>

                <Text className="text-white text-2xl font-bold mb-6 text-center">
                    Start Session
                </Text>

                {/* Empty training*/}
                <OptionCard 
                    title="Empty Workout" 
                    subtitle="Start from scratch, logging as you go"
                    icon="add"
                    color="blue"
                    onPress={() => {
                        onClose();
                        onStartEmpty();
                    }}
                />

                {/* From template */}
                <OptionCard 
                    title="From Template" 
                    subtitle="Use a saved routine (Push, Pull, etc.)"
                    icon="copy-outline"
                    color="purple"
                    onPress={() => {
                        onClose();
                        onStartTemplate();
                    }}
                />

                {/* Cancel */}
                <TouchableOpacity 
                    onPress={onClose}
                    className="mt-2 py-4 items-center"
                >
                    <Text className="text-gray-500 font-bold text-lg">Cancel</Text>
                </TouchableOpacity>

            </View>
            </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
}