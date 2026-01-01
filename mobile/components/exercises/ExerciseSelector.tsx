import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExercises } from '@/hooks/useExercises';
import ExerciseRow from './ExerciseSingle'; 
import { Exercise, Muscle, Category, Level } from '@/types/exercise';

interface Props {
    onItemPress: (exercise: Exercise) => void;
}

export default function ExerciseSelector({ onItemPress }: Props) {
  const { 
    exercises, loading, 
    searchQuery, setSearchQuery, 
    selectedMuscle, setSelectedMuscle,
    selectedCategory, setSelectedCategory,
    loadMore 
  } = useExercises();

  // Available filter options
  const MUSCLES = Object.values(Muscle);
  const CATEGORIES = Object.values(Category);

  const FilterChip = ({ label, isSelected, onPress }: any) => (
    <TouchableOpacity 
        onPress={onPress}
        className={`px-3 py-2 rounded-full mr-2 border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-gray-800 border-gray-700'}`}
    >
        <Text className={`text-xs font-bold capitalize ${isSelected ? 'text-white' : 'text-gray-400'}`}>
            {label}
        </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      
      {/* 1. SEARCH BAR */}
      <View className="px-4 py-2">
        <View className="bg-gray-900 flex-row items-center px-1 py-0 rounded-xl border border-gray-800">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput 
                className="flex-1 text-white ml-2 text-base"
                placeholder="Search exercises..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
            />
             {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                </TouchableOpacity>
            )}
        </View>
      </View>

      {/* 2. FILTERS */}
      <View>
          {/* Row 1: Muscles */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            {selectedMuscle && (
                <TouchableOpacity onPress={() => setSelectedMuscle(null)} className="mr-2 justify-center">
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
            )}
            {MUSCLES.map(m => (
                <FilterChip 
                    key={m} 
                    label={m} 
                    isSelected={selectedMuscle === m} 
                    onPress={() => setSelectedMuscle(selectedMuscle === m ? null : m)} 
                />
            ))}
          </ScrollView>

          {/* Row 2: Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}>
             {selectedCategory && (
                <TouchableOpacity onPress={() => setSelectedCategory(null)} className="mr-2 justify-center">
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
            )}
             {CATEGORIES.map(c => (
                <FilterChip 
                    key={c} 
                    label={c} 
                    isSelected={selectedCategory === c} 
                    onPress={() => setSelectedCategory(selectedCategory === c ? null : c)} 
                />
            ))}
          </ScrollView>
      </View>

      {/* 3. LIST */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <ExerciseRow item={item} onPress={onItemPress} />
        )}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator color="#3B82F6" className="mt-4" /> : <View className="h-10" />}
        ListEmptyComponent={!loading ? (
            <View className="items-center mt-10">
                <Text className="text-gray-500 text-lg">No exercises found.</Text>
            </View>
        ) : null}
      />
    </View>
  );
}