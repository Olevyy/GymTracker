import React from 'react';
import { 
    View, 
    Text, 
    ActivityIndicator, 
    TouchableOpacity, 
    FlatList, 
    ScrollView,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';


import { useVolumeStats } from '@/hooks/useVolumeStats';
import { Muscle } from '@/types/exercise';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
    const router = useRouter();
    
    const { 
        loading, 
        data, 
        chartData, 
        yAxisConfig, 
        muscleList, 
        selectedMuscle, 
        focusedBar, 
        setSelectedMuscle,
        setFocusedBar 
    } = useVolumeStats();

    // Filter render item
    const renderMuscleFilter = ({ item }: { item: string }) => {
        const isSelected = selectedMuscle === item;
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedMuscle(isSelected ? null : item as Muscle);
                    setFocusedBar(null);
                }}
                className={`px-4 py-2 rounded-full mr-2 border ${
                    isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-900 border-gray-700'
                }`}
            >
                <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {item.toUpperCase().replace('_', ' ')}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            
            {/* --- HEADER --- */}
            <View className="flex-row items-center p-4 border-b border-gray-900 mb-2">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Statistics</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                
                {/* --- FILTERS --- */}
                <View className="mb-6 mt-2">
                    <FlatList
                        data={muscleList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderMuscleFilter}
                        keyExtractor={(item) => item}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                </View>

                {loading && !data ? (
                    <View className="h-60 justify-center items-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : (
                    <>
                        {/* --- SUMMARY --- */}
                        <View className="flex-row justify-between px-4 mb-6 space-x-4">
                            <View className="flex-1 bg-gray-900 p-4 rounded-xl border border-gray-800 items-center">
                                <Ionicons name="barbell-outline" size={24} color="#60A5FA" style={{marginBottom: 8}} />
                                <Text className="text-gray-500 text-[10px] uppercase mb-1">Total Volume</Text>
                                <Text className="text-white text-lg font-bold">
                                    {(data?.summary.total_volume || 0).toLocaleString()} <Text className="text-sm font-normal text-gray-500">kg</Text>
                                </Text>
                            </View>

                            <View className="flex-1 bg-gray-900 p-4 rounded-xl border border-gray-800 items-center">
                                <Ionicons name="calendar-outline" size={24} color="#FBBF24" style={{marginBottom: 8}} />
                                <Text className="text-gray-500 text-[10px] uppercase mb-1">Workouts</Text>
                                <Text className="text-white text-lg font-bold">
                                    {data?.summary.total_workouts || 0}
                                </Text>
                            </View>
                        </View>

                        {/* --- CHART --- */}
                        <View className="mx-4 bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
                            
                            {/* HEADER */}
                            <View className="flex-row justify-between items-center mb-8 px-2">
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold uppercase">
                                        {focusedBar ? 'Selected Month' : 'Yearly Trend'}
                                    </Text>
                                    <Text className="text-white text-2xl font-bold mt-1">
                                        {focusedBar ? focusedBar.label : 'Last 12 Months'}
                                    </Text>
                                </View>
                                {focusedBar && (
                                    <View>
                                        <Text className="text-gray-400 text-xs font-bold uppercase text-right">Volume</Text>
                                        <Text className="text-blue-500 text-xl font-bold text-right">
                                            {(focusedBar.value / 1000).toFixed(1)}k <Text className="text-sm text-gray-500">kg</Text>
                                        </Text>
                                    </View>
                                )}
                            </View>
                            
                            {chartData.length > 0 ? (
                                <View className="overflow-hidden">
                                    <BarChart
                                        data={chartData}
                                        barWidth={32}
                                        spacing={24}
                                        roundedTop
                                        roundedBottom
                                        
                                        // Y
                                        noOfSections={yAxisConfig.noOfSections}
                                        maxValue={yAxisConfig.maxValue}
                                        yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
                                        yAxisThickness={0}
                                        rulesColor={'#374151'}
                                        
                                        // X
                                        xAxisThickness={1}
                                        xAxisColor={'#374151'}
                                        xAxisLabelsHeight={24}
                                        
                                        height={220}
                                        width={screenWidth - 80}
                                        scrollToEnd={true}
                                        isAnimated={true}
                                        
                                    />
                                </View>
                            ) : (
                                <View className="h-40 justify-center items-center">
                                    <Text className="text-gray-500">No data available</Text>
                                </View>
                            )}
                             <Text className="text-center text-gray-600 text-[10px] mt-6">
                                Tap on a bar to see details
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

