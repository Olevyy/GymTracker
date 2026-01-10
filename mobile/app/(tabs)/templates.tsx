import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTemplates } from '@/hooks/useTemplate';
import { WorkoutTemplate } from '@/services/templateService';

export default function RoutinesScreen() {
  const router = useRouter();
  
  const { templates, loading, removeTemplate, refresh } = useTemplates();

  const handleEdit = (id: number) => {
    router.push(`/screens/templates/${id}`);
    };



  const handleDelete = (id: number) => {
      Alert.alert(
          "Delete Routine", 
          "Are you sure you want to delete this routine? This cannot be undone.", 
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Delete", 
                  style: "destructive", 
                  onPress: () => removeTemplate(id) 
              }
          ]
      );
  };

  // Each template
  const renderItem = ({ item }: { item: WorkoutTemplate }) => (
    <TouchableOpacity 
        onPress={() => handleEdit(item.id)}
        activeOpacity={0.7}
        className="bg-gray-900 rounded-2xl mb-4 p-4 border border-gray-800"
    >
        
        <View className="flex-row justify-between items-start mb-2">
            <Text className="text-white text-xl font-bold flex-1 mr-2">{item.name}</Text>
            
            <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-1">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
        
        {/* Notes */}
        {item.notes ? (
            <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                {item.notes}
            </Text>
        ) : null}

        {/* Exercises */}
        <View className="flex-row flex-wrap mt-1">
            {item.exercises.slice(0, 5).map((ex, i) => (
                    <View key={ex.id || i} className="bg-gray-800 px-2 py-1 rounded mr-2 mb-2 border border-gray-700">
                    <Text className="text-gray-300 text-xs font-medium">
                        {ex.sets_count} x {ex.exercise_name}
                    </Text>
                    </View>
            ))}
            {item.exercises.length > 5 && (
                <Text className="text-gray-500 text-xs py-1 self-center mb-2">
                    + {item.exercises.length - 5} more
                </Text>
            )}
        </View>
    </TouchableOpacity>
  );

  // Main view
  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-4 py-4 mb-2">
         <Text className="text-white text-3xl font-bold">Routines</Text>
         
         {/* Add */}
         <TouchableOpacity onPress={() => router.push('/screens/templates/create')}>
            <Ionicons name="add-circle" size={36} color="#3B82F6" />
         </TouchableOpacity>
      </View>

      {/* List */}
      {loading && templates.length === 0 ? (
          <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
          </View>
      ) : (
          <FlatList 
            data={templates}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#3B82F6" />
            }

            ListEmptyComponent={(
                <View className="items-center justify-center mt-20 opacity-80">
                     <View className="bg-gray-900 p-6 rounded-full mb-4 border border-gray-800">
                         <Ionicons name="clipboard-outline" size={64} color="#374151" />
                     </View>
                     <Text className="text-white text-xl font-bold">No routines found</Text>
                     <Text className="text-gray-500 mt-2 text-center px-10 leading-6">
                        You don't have any workout templates yet. {'\n'}
                        Tap the <Text className="text-blue-500 font-bold">+</Text> icon to create one!
                     </Text>
                </View>
            )}
          />
      )}
    </SafeAreaView>
  );
}