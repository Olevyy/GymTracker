// Shows users history for exercise - overall records, chart over time
import React, { useState } from 'react';
import { View, Text, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ExerciseHistoryItem, ExerciseRecords } from '@/services/exercisesService';

interface Props {
    history: ExerciseHistoryItem[];
    records: ExerciseRecords | null;
}

const RecordCard = ({ title, data, icon, color }: any) => {
    let displayValue = '0';
    let unit = 'kg';
    let subText = '';

    if (data) {
        if (title === 'Max Weight') {
            displayValue = parseFloat(data.weight).toFixed(1);
            subText = `x ${data.reps}`;
        } else {
            displayValue = parseFloat(data.value).toFixed(1);
        }
    }

    return (
        <View className="bg-gray-900 flex-1 p-4 rounded-xl border border-gray-800 mx-1">
            <View className="flex-row items-center mb-2">
                <Ionicons name={icon} size={18} color={color} />
                <Text className="text-gray-400 text-xs font-bold ml-1 uppercase">{title}</Text>
            </View>
            <Text className="text-white text-2xl font-bold">
                {displayValue} 
                <Text className="text-sm text-gray-500 font-normal"> {unit}</Text>
                {subText && <Text className="text-sm text-gray-500 font-normal"> {subText}</Text>}
            </Text>
            <Text className="text-gray-500 text-[10px] mt-1">
                {data ? new Date(data.date).toLocaleDateString() : '-'}
            </Text>
        </View>
    );
};

export default function ExerciseHistoryTab({ history, records }: Props) {
    const router = useRouter();
    const [selectedPoint, setSelectedPoint] = useState<ExerciseHistoryItem | null>(null);
    
    if (history.length === 0) {
        return (
            <View className="items-center justify-center py-20 opacity-50">
                <Ionicons name="stats-chart" size={64} color="#4B5563" />
                <Text className="text-gray-400 mt-4 text-center">No history yet.{'\n'}Complete a workout to see stats.</Text>
            </View>
        );
    }

    // Prepare chart data (reverse to show chronological order)
    const chartDataReversed = [...history].reverse();
    const limitedData = chartDataReversed.slice(-10);
    
    const chartData = limitedData.map((h, index) => ({
        value: h.session_1rm || 0,
        label: `${new Date(h.date).getDate()}/${new Date(h.date).getMonth() + 1}`,
        onPress: () => setSelectedPoint(limitedData[index])
    }));

    return (
        <View className="pb-10 px-4 pt-4">
            
        {/*RECORDS CARDS */}
        <View className="flex-row justify-between mb-6">
            <RecordCard 
                title="Max Weight" 
                data={records?.max_weight} 
                icon="barbell" 
                color="#60A5FA"
            />
            <RecordCard 
                title="Best 1RM" 
                data={records?.best_1rm} 
                icon="trophy" 
                color="#FBBF24" 
            />
        </View>

        {/* CHART */}
        <View className="mb-8">
            <Text className="text-white font-bold text-lg mb-4 ml-1">1RM Progress [kg]</Text>
            {/* Check if we have data to draw */}
            {chartData.some(d => d.value > 0) ? (() => {
                const maxDataVal = Math.max(...chartData.map(d => d.value));
                const stepValue = Math.ceil((maxDataVal * 1.1) / 5);
                return (
                <LineChart
                    data={chartData}
                    width={Dimensions.get("window").width - 32}
                    height={220}
                    color="#3B82F6"
                    thickness={3}
                    dataPointsColor="#3B82F6"
                    dataPointsRadius={6}
                    yAxisTextStyle={{ color: '#9CA3AF' }}
                    xAxisLabelTextStyle={{ color: '#9CA3AF' }}
                    backgroundColor="#111827"
                    showVerticalLines={false}
                    spacing={40}
                    initialSpacing={20}
                    endSpacing={20}
                    yAxisColor="#9CA3AF"
                    xAxisColor="#9CA3AF"
                    rulesColor="#374151"

                    maxValue={stepValue * 5}
                    stepValue={stepValue}
                />
                );
            })() : (
                <View className="h-40 bg-gray-900 rounded-xl items-center justify-center border border-gray-800">
                    <Text className="text-gray-500">Not enough data for chart</Text>
                </View>
            )}
        </View>

        {/* RECENT HISTORY LIST */}
        <Text className="text-white font-bold text-lg mb-4 ml-1">Recent Sessions</Text>
        {history.map((item) => (
            <TouchableOpacity 
                key={item.workout_id} 
                className="bg-gray-900 mb-3 rounded-xl border border-gray-800 p-4"
                onPress={() => router.push(`/screens/workout/${item.workout_id}`)}
            >
                <View className="flex-row justify-between items-center mb-3 border-b border-gray-800 pb-2">
                    <View>
                        <Text className="text-white font-bold">{new Date(item.date).toLocaleDateString()}</Text>
                        <Text className="text-gray-500 text-xs">{item.workout_name}</Text>
                    </View>
                    {item.session_1rm > 0 && (
                            <View className="bg-blue-900/30 px-2 py-1 rounded">
                            <Text className="text-blue-400 text-xs font-bold">1RM: {item.session_1rm}</Text>
                            </View>
                    )}
                </View>
                
                {/* Sets Grid */}
                <View className="flex-row flex-wrap">
                    {item.sets.map((set, i) => (
                        <View key={i} className="bg-gray-800 px-3 py-1.5 rounded mr-2 mb-2 flex-row items-center border border-gray-700">
                            <Text className="text-white font-bold">{parseFloat(set.weight).toString()}kg</Text>
                            <Text className="text-gray-500 text-xs mx-1">x</Text>
                            <Text className="text-white font-bold">{set.reps}</Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
            ))}

        {/* Modal for selected point */}
        <Modal visible={!!selectedPoint} transparent animationType="fade">
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className="bg-gray-900 p-6 rounded-xl border border-gray-800 mx-4">
                    <Text className="text-white text-lg font-bold mb-4">Session Details</Text>
                    {selectedPoint && (
                        <>
                            <Text className="text-gray-400 mb-2">Date: {new Date(selectedPoint.date).toLocaleDateString()}</Text>
                            <Text className="text-gray-400 mb-2">Workout: {selectedPoint.workout_name}</Text>
                            <Text className="text-white font-bold mb-4">1RM: {selectedPoint.session_1rm} kg</Text>
                           
                        </>
                    )}
                    <TouchableOpacity 
                        className="bg-blue-600 p-3 rounded-lg mt-4"
                        onPress={() => setSelectedPoint(null)}
                    >
                        <Text className="text-white text-center font-bold">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </View>
    );
}