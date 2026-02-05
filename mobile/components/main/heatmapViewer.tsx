// Heatmap component - shows latest muscle activity
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Body, { Slug } from 'react-native-body-highlighter';
import { HeatmapData } from '@/services/workoutService';

interface HeatmapViewerProps {
    data: HeatmapData[]; 
}

export default function HeatmapViewer({ data }: HeatmapViewerProps) {
    const [side, setSide] = useState<'front' | 'back'>('front');

    const CUSTOM_COLORS = [
        '#e6e6e6',
        '#ffb3b3', 
        '#ff8080', 
        '#ff3333',  
        '#cc0000'  
    ];

    return (
        <View className="bg-gray-900 p-4 rounded-2xl border border-gray-800 mt-6 items-center">
            
            <View className="flex-row justify-between w-full items-center mb-6">
                <Text className="text-white font-bold text-lg">Muscle Activity</Text>
                
                <View className="flex-row bg-gray-800 rounded-lg p-1">
                    <TouchableOpacity 
                        onPress={() => setSide('front')}
                        className={`px-3 py-1.5 rounded-md ${side === 'front' ? 'bg-blue-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-xs font-bold ${side === 'front' ? 'text-white' : 'text-gray-400'}`}>Front</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setSide('back')}
                        className={`px-3 py-1.5 rounded-md ${side === 'back' ? 'bg-blue-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-xs font-bold ${side === 'back' ? 'text-white' : 'text-gray-400'}`}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* HEATMAP */}
            <Body
                key={`${side}-${JSON.stringify(data)}`} // Force rerender
                data={data as { slug: Slug; intensity: number }[]}
                colors={CUSTOM_COLORS}
                gender="male"
                side={side}
                scale={1.2}
            />
        </View>
    );
}