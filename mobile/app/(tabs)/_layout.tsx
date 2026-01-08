import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from '@expo/vector-icons'; 

export default function TabsLayout() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/(auth)/login");
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarStyle: { 
                backgroundColor: '#000000', 
                borderTopColor: '#333333', 
                height: 60,
                paddingBottom: 5 
            },
            tabBarActiveTintColor: '#3B82F6', 
            tabBarInactiveTintColor: '#6B7280',
        }}>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: 'Start',
                    tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />
                }} 
            />
            <Tabs.Screen 
                name="my-workouts" 
                options={{ 
                    title: 'History',
                    tabBarIcon: ({color}) => <Ionicons name="journal" size={24} color={color} />
                }} 
            />
            <Tabs.Screen 
                name="templates" 
                options={{ 
                    title: 'Templates',
                    tabBarIcon: ({color}) => <Ionicons name="clipboard" size={24} color={color} />
                }} 
            />
            <Tabs.Screen 
                    name="menu" 
                    options={{ 
                        title: 'Menu',
                        tabBarIcon: ({color}) => <Ionicons name="menu" size={24} color={color} />
                    }} 
            />
        </Tabs>
    );
}