// Welcome screen - create new training
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from 'expo-router'
import StartWorkoutModal from '@/components/workout/startWorkoutModal';

export default function HomeScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const handleStartEmpty = () => {
      router.push("/screens/workout")
  };

  const handleStartTemplate = () => {
      Alert.alert("Coming Soon", "Templates functionality is under construction.");
  };

  


  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        

        <View className="mb-8">
          <Text className="text-gray-400 text-sm font-medium">Hi buddy</Text>
          <Text className="text-white text-3xl font-bold">Ready for some grind? 💪</Text>
        </View>

        <TouchableOpacity 
          className="bg-blue-600 rounded-2xl p-6 flex-row items-center justify-between shadow-lg shadow-blue-900/50 mb-6"
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <View>
            <Text className="text-white text-xl font-bold">Begin workout</Text>
            <Text className="text-blue-100 text-sm mt-1">New empty or from template</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <Ionicons name="add" size={32} color="white" />
          </View>
        </TouchableOpacity>

        <Text className="text-white text-lg font-bold mb-4">In this month</Text>
        
        <View className="flex-row justify-between mb-4">
          <View className="bg-gray-900 w-[48%] p-4 rounded-xl border border-gray-800">
            <Ionicons name="flame" size={24} color="#EF4444" />
            <Text className="text-white text-2xl font-bold mt-2">0</Text>
            <Text className="text-gray-500 text-xs">Workouts</Text>
          </View>
          
          <View className="bg-gray-900 w-[48%] p-4 rounded-xl border border-gray-800">
            <Ionicons name="barbell" size={24} color="#3B82F6" />
            <Text className="text-white text-2xl font-bold mt-2">0 kg</Text>
            <Text className="text-gray-500 text-xs">Volume</Text>
          </View>
        </View>

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