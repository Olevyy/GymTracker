// Renders a single exercise row with image, name, muscles, and category
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise, Category } from '@/types/exercise';

interface Props {
    item: Exercise;
    onPress: (item: Exercise) => void;
    onViewDetails?: (item: Exercise) => void;
}

export default function ExerciseRow({ item, onPress, onViewDetails }: Props) {
    const [imageError, setImageError] = useState(false);
    
    const imageUrl = item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : null;

    // Colors for categories
    const getCategoryStyles = (cat: Category) => {
        switch (cat) {
            case Category.cardio: 
                return { bg: 'bg-orange-900/30', text: 'text-orange-400' };
            
            case Category.stretching: 
                return { bg: 'bg-green-900/30', text: 'text-green-400' };
            
            case Category.powerlifting:
            case Category.strength:
            case Category.strongman:
            case Category.olympic_weightlifting: 
                return { bg: 'bg-red-900/30', text: 'text-red-400' };
            
            case Category.plyometrics: 
                return { bg: 'bg-yellow-900/30', text: 'text-yellow-400' };
            
            default: 
                return { bg: 'bg-black-800', text: 'text-white-400' };
        }
    };


    const allMuscles = [
        ...item.primary_muscles.map(m => ({ name: m, type: 'primary' })),
        ...item.secondary_muscles.map(m => ({ name: m, type: 'secondary' }))
    ];

    // Limit muscles to display
    const visibleMuscles = allMuscles.slice(0, 3); 
    const categoryStyle = item.category ? getCategoryStyles(item.category) : null;
    return (
        <TouchableOpacity 
            className="flex-row bg-gray-900 mb-3 rounded-xl overflow-hidden border border-gray-800 h-32"
            onPress={() => onPress(item)}
            onLongPress={onViewDetails ? () => onViewDetails(item) : undefined}
            activeOpacity={0.7}
        >
            {/* Image */}
        <View className="w-40 h-full bg-gray items-center justify-center overflow-hidden relative">
            {imageUrl && !imageError ? (
                <Image 
                    source={{ uri: imageUrl }} 
                    className="w-full h-full"
                    resizeMode="contain"
                    onError={() => setImageError(true)}
                />
            ) : (
                <Ionicons name="barbell" size={32} color="#9CA3AF" />
            )}
        </View>

        {/* Content */}
        <View className="flex-1 p-3 justify-center">
            <Text className="text-white text-base font-bold mb-1 mr-2" numberOfLines={1}>
                {item.name}
            </Text>
            
            <View className="flex-row flex-wrap mt-1">

                {visibleMuscles.map((muscle, index) => (
                    <View 
                        key={index} 
                        // If primary muscle, use blue shades; if secondary, use gray shades
                        className={`px-2 py-0.5 rounded mr-1 mb-1 ${
                            muscle.type === 'primary' ? 'bg-blue-900/40' : 'bg-gray-800 border border-gray-700'
                        }`}
                    >
                        <Text 
                            className={`text-[10px] capitalize font-medium ${
                                muscle.type === 'primary' ? 'text-blue-300' : 'text-gray-400'
                            }`}
                        >
                            {muscle.name}
                        </Text>
                    </View>
                ))}
                
                {/* Category tag */}
                {item.category && categoryStyle ? (
                        <View className={`px-2 py-0.5 rounded mb-1 ${categoryStyle.bg}`}>
                             <Text className={`text-[10px] capitalize font-bold opacity-90 ${categoryStyle.text}`}>
                                {item.category}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

        {/* Arrow */}
        <View className="justify-center pr-3">
                <Ionicons name="chevron-forward" size={20} color="#4B5563" />
        </View>
        </TouchableOpacity>
    );
}