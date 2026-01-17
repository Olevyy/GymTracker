import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { logoutUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function MenuScreen() {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              await logoutUser();
              await checkAuth();
              router.replace('/(auth)/login'); 
            } catch (error) {
              Alert.alert("Error", "Failed to log out.");
            }
          }
        }
      ]
    );
  };

  // Helper component for menu items
  const MenuOption = ({ title, icon, color = "white", onPress, subtitle }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between bg-gray-900 p-4 rounded-xl mb-3 border border-gray-800 active:bg-gray-800"
    >
      <View className="flex-row items-center flex-1">
        <View className="bg-gray-800 p-2 rounded-lg">
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View className="ml-3 flex-1">
            <Text className={`text-base font-medium ${color === '#EF4444' ? 'text-red-500' : 'text-white'}`}>
                {title}
            </Text>
            {subtitle && <Text className="text-gray-500 text-xs">{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-white text-3xl font-bold mb-6">Menu</Text>

        {/* --- SECTION: TOOLS --- */}
        <Text className="text-gray-500 text-xs font-bold uppercase mb-2 ml-1 tracking-wider">Tools</Text>
        
        <MenuOption 
            title="Exercise Library" 
            subtitle="Browse, search and add exercises"
            icon="library-outline" 
            color="#3B82F6" // Blue
            onPress={() => router.push('/screens/exercises')}
        />
         <MenuOption 
            title="Statistics & Charts" 
            subtitle="Progress, volume, frequency"
            icon="stats-chart-outline" 
            color="#10B981" // Green
            onPress={() => console.log("Navigate to Stats")} 
        />
        <MenuOption 
            title="1RM / RPE Calculator" 
            subtitle="Calculate your maxes"
            icon="calculator-outline" 
            color="#F59E0B" // Orange
            onPress={() => router.push('/screens/menu/calculator')}
        />

        {/* SECTION: ACCOUNT */}
        <View className="mt-4">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-2 ml-1 tracking-wider">Account</Text>
            
            <MenuOption 
                title="My Profile" 
                icon="person-outline" 
                onPress={() => console.log("Profile")} 
            />
             <MenuOption 
                title="Settings" 
                icon="settings-outline" 
                onPress={() => console.log("Settings")} 
            />
            
            {/* Logout Button */}
            <MenuOption 
                title="Log Out" 
                icon="log-out-outline" 
                color="#EF4444" 
                onPress={handleLogout} 
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}