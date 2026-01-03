import React, {useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHistory } from '@/hooks/useHistory';
import { useRouter } from 'expo-router';

export default function MyWorkoutsScreen() {
  const router = useRouter();
  const { workouts, loading, error, startDate, endDate, setStartDate, setEndDate, refetch } = useHistory();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const onDateChange = (event: any, selectedDate?: Date, type?: 'start' | 'end') => {
    if (type === 'start') setShowStartPicker(false);
    if (type === 'end') setShowEndPicker(false);

    if (selectedDate) {
      if (type === 'start') setStartDate(selectedDate);
      if (type === 'end') setEndDate(selectedDate);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4 pb-2">
        <Text className="text-white text-2xl font-bold">Workout History</Text>
      </View>

      {/* Data filter section */}
      <View className="flex-row justify-between items-center px-4 mb-4">
          {/* From (date) */}
          <TouchableOpacity 
              onPress={() => setShowStartPicker(true)}
              className="bg-gray-900 p-3 rounded-lg flex-1 mr-2 flex-row justify-between items-center border border-gray-800"
          >
              <View>
                  <Text className="text-gray-400 text-xs">From</Text>
                  <Text className="text-white font-bold">{formatDate(startDate)}</Text>
              </View>
              <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
          </TouchableOpacity>

          {/* To (date) */}
          <TouchableOpacity 
              onPress={() => setShowEndPicker(true)}
              className="bg-gray-900 p-3 rounded-lg flex-1 ml-2 flex-row justify-between items-center border border-gray-800"
          >
              <View>
                  <Text className="text-gray-400 text-xs">To</Text>
                  <Text className="text-white font-bold">{formatDate(endDate)}</Text>
              </View>
              <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
          </TouchableOpacity>

          {/* Calendar modals (invisible, open on click) */}
          {(showStartPicker) && (
              <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  maximumDate={new Date()} // Cannot pick future dates
                  onChange={(e, date) => onDateChange(e, date, 'start')}
              />
          )}
          {(showEndPicker) && (
              <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(e, date) => onDateChange(e, date, 'end')}
              />
          )}
      </View>


      {workouts.length === 0 ? (
        // Empty stae
        <View className="flex-1 justify-center items-center p-8 opacity-80">
          <View className="bg-gray-900 p-6 rounded-full mb-4">
            <Ionicons name="time-outline" size={64} color="#4B5563" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">No workouts found</Text>
          <Text className="text-gray-500 text-center">
            No workouts found in the selected date range. Try adjusting your filters or start a new workout!
          </Text>
        </View>
      ) : (
       // Workout list
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()} // Id from backend as String
          contentContainerStyle={{ padding: 16 }}
          
          // Refresh control for pull-to-refresh
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#3B82F6" />
          }
          
          // Each workout item
          renderItem={({ item }) => (
            <TouchableOpacity 
            className="bg-gray-900 p-4 rounded-xl mb-3 border border-gray-800 flex-row justify-between items-center"
            onPress={() => router.push(`/screens/workout/${item.id}`)}
            >
              <View>
                  <Text className="text-white text-lg font-bold">{item.name || 'Unnamed Workout'}</Text>
                  <Text className="text-gray-400 text-sm mt-1">
                      {new Date(item.start_time).toLocaleDateString('en-US', { 
                          weekday: 'short', day: 'numeric', month: 'long' 
                      })}
                  </Text>
                  
                  {/* Status Badge */}
                  <View className={`mt-2 self-start px-2 py-0.5 rounded ${item.status === 'completed' ? 'bg-green-900/30' : 'bg-yellow-900/30'}`}>
                      <Text className={`text-xs ${item.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {item.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Text>
                  </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}