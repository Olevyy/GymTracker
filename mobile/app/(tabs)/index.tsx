// Welcome screen - create new training
import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from 'expo-router'
import { customAlert } from '@/components/main/CustomAlert';
import StartWorkoutModal from '@/components/main/startWorkoutModal';
import { getWorkoutStats, WorkoutStats } from '@/services/workoutService';
import HeatmapViewer from '@/components/main/heatmapViewer';
import { useActiveWorkout } from '@/contexts/WorkoutContext';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { resetWorkout } = useActiveWorkout();
  const { activeExercises, startEmptyWorkout, isLoadingStorage } = useActiveWorkout();

  const handleBeginPress = () => {
      if (activeExercises.length > 0) {
          customAlert(
              "Workout in Progress",
              "Starting a new workout will discard your current progress.",
              [
                  { text: "Cancel", style: "cancel" },
                  { 
                      text: "Start New", 
                      style: "destructive", 
                      onPress: () => setModalVisible(true)
                  }
              ]
          );
      } else {
          setModalVisible(true);
      }
  };

  const handleStartEmpty = () => {
      setModalVisible(false);
      startEmptyWorkout(); 
      router.push("/screens/workout/"); 
  };

  const handleStartTemplate = () => {
      setModalVisible(false);
      router.push("/screens/workout/templateSelector");
  };

  const handleResume = () => {
      router.push("/screens/workout/");
  };

  const fetchStats = useCallback(async () => {
    try {
      const data = await getWorkoutStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, [fetchStats]);


  const formatVolume = (vol?: number) => {
    if (!vol) return "0 kg";
    return vol >= 1000 ? `${(vol / 1000).toFixed(1)}k kg` : `${vol} kg`;
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        

        <View className="mb-8">
          <Text className="text-gray-400 text-xl font-medium">Hi buddy</Text>
          <Text className="text-white text-2xl font-bold">Ready for some grind? 💪</Text>
        </View>

        {/* Continue exercise alert */}
        {!isLoadingStorage && activeExercises.length > 0 && (
             <TouchableOpacity 
                className="bg-green-600 rounded-2xl p-3 flex-row items-center justify-between shadow-lg shadow-green-900/50 mb-6 border border-green-500"
                activeOpacity={0.8}
                onPress={handleResume}
              >
                <View>
                  <Text className="text-white text-lg font-bold">Resume Workout</Text>
                  <Text className="text-green-100 text-sm mt-1">
                      {activeExercises.length} exercises in progress
                  </Text>
                </View>
                <View className="bg-white/20 p-2 rounded-full">
                  <Ionicons name="play" size={32} color="white" />
                </View>
            </TouchableOpacity>
        )}

        <TouchableOpacity 
          className="bg-blue-600 rounded-2xl p-6 flex-row items-center justify-between shadow-lg shadow-blue-900/50 mb-6"
          activeOpacity={0.8}
          onPress={handleBeginPress}
        >
          <View>
            <Text className="text-white text-xl font-bold">Begin workout</Text>
            <Text className="text-blue-100 text-sm mt-1">New empty or from template</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <Ionicons name="add" size={32} color="white" />
          </View>
        </TouchableOpacity>

        <Text className="text-white text-lg font-bold mb-4">In last 7 days</Text>
        
       {loading ? (
            <View className="h-40 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-4 text-xs">Loading gains...</Text>
            </View>
        ) : (
            <>
                <View className="flex-row justify-between mb-2">
                  <View className="bg-gray-900 w-[48%] p-4 rounded-xl border border-gray-800 items-center">
                    <Ionicons name="flame" size={24} color="#EF4444" />
                    <Text className="text-white text-2xl font-bold mt-2">{stats?.workouts_count || 0}</Text>
                    <Text className="text-gray-500 text-xs uppercase tracking-wider">Workouts</Text>
                  </View>
                  
                  <View className="bg-gray-900 w-[48%] p-4 rounded-xl border border-gray-800 items-center">
                    <Ionicons name="barbell" size={24} color="#3B82F6" />
                    <Text className="text-white text-2xl font-bold mt-2">{formatVolume(stats?.total_volume)}</Text>
                    <Text className="text-gray-500 text-xs uppercase tracking-wider">Volume</Text>
                  </View>
                </View>

                {/* Component of body and muscles highlightet  */}
                <HeatmapViewer 
                    data={stats?.body_parts || []} 
                />
            </>
        )}

      </ScrollView>
      <StartWorkoutModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartEmpty={handleStartEmpty}
        onStartTemplate={handleStartTemplate}
      />

    </SafeAreaView>
  );
}