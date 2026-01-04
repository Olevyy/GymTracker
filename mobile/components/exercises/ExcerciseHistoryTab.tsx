// Shows users history for exercise - overall records, chart over time
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseHistoryItem, ExerciseRecords } from '@/services/exercisesService';

interface Props {
    history: ExerciseHistoryItem[];
    records: ExerciseRecords | null;
}

const RecordCard = ({ title, data, icon, color }: any) => (
    <View className="bg-gray-900 flex-1 p-4 rounded-xl border border-gray-800 mx-1">
        <View className="flex-row items-center mb-2">
            <Ionicons name={icon} size={18} color={color} />
            <Text className="text-gray-400 text-xs font-bold ml-1 uppercase">{title}</Text>
        </View>
        <Text className="text-white text-2xl font-bold">
            {data?.value ? parseFloat(data.value).toFixed(1) : '0'} 
            <Text className="text-sm text-gray-500 font-normal"> kg</Text>
        </Text>
        <Text className="text-gray-500 text-[10px] mt-1">
            {data ? new Date(data.date).toLocaleDateString() : '-'}
        </Text>
    </View>
);

export default function ExerciseHistoryTab({ history, records }: Props) {
    
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
    
    const chartLabels = limitedData.map(h => {
        const d = new Date(h.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });
    
    const chartValues = limitedData.map(h => h.session_1rm || 0);

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
            <Text className="text-white font-bold text-lg mb-4 ml-1">1RM Progress</Text>
            {/* Check if we have data to draw */}
            {chartValues.some(v => v > 0) ? (
                <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [{ data: chartValues }]
                    }}
                    width={Dimensions.get("window").width - 32} 
                    height={220}
                    yAxisSuffix="kg"
                    chartConfig={{
                        backgroundColor: "#000000",
                        backgroundGradientFrom: "#111827",
                        backgroundGradientTo: "#111827",
                        decimalPlaces: 0, 
                        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, 
                        labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, 
                        propsForDots: { r: "4", strokeWidth: "2", stroke: "#3B82F6" }
                    }}
                    bezier
                    style={{ borderRadius: 16 }}
                />
            ) : (
                <View className="h-40 bg-gray-900 rounded-xl items-center justify-center border border-gray-800">
                    <Text className="text-gray-500">Not enough data for chart</Text>
                </View>
            )}
        </View>

        {/* RECENT HISTORY LIST */}
        <Text className="text-white font-bold text-lg mb-4 ml-1">Recent Sessions</Text>
        {history.map((item) => (
            <View key={item.workout_id} className="bg-gray-900 mb-3 rounded-xl border border-gray-800 p-4">
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
            </View>
            ))}
        </View>
    );
}