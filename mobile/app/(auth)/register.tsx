import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { registerUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { checkAuth } = useAuth(); // Refresh session function
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Simple validation
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Register error', 'Fill all fields please.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Register error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        username: form.username,
        email: form.email,
        password1: form.password,
        password2: form.confirmPassword 
      };
      // Call register API
      await registerUser(registerData);
      // Refresh global state (Context will know we have a token)
      await checkAuth();
      router.replace('/(tabs)');
      
    } catch (error: any) {
      Alert.alert('Register error', error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          
          <View className="items-center mb-8">
             <Text className="text-white text-3xl font-bold">Create Account</Text>
             <Text className="text-gray-400 mt-2">Track your workouts!</Text>
          </View>

          <View className="space-y-4">
            <View>
                <Text className="text-gray-400 mb-2 ml-1">Nazwa użytkownika</Text>
                <TextInput
                className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800"
                placeholder="Np. Arnold"
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                value={form.username}
                onChangeText={(text) => setForm({...form, username: text})}
                />
            </View>

            <View className="mt-4">
                <Text className="text-gray-400 mb-2 ml-1">Email</Text>
                <TextInput
                className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800"
                placeholder="adres@email.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm({...form, email: text})}
                />
            </View>

            <View className="mt-4">
                <Text className="text-gray-400 mb-2 ml-1">Password</Text>
                <TextInput
                className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800"
                placeholder="Min. 8 znaków"
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({...form, password: text})}
                />
            </View>

            <View className="mt-4">
                <Text className="text-gray-400 mb-2 ml-1">Confirm Password</Text>
                <TextInput
                className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800"
                placeholder="Confirm your password"
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(text) => setForm({...form, confirmPassword: text})}
                />
            </View>

            <TouchableOpacity
                className={`bg-blue-600 p-4 rounded-xl mt-8 items-center ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                <ActivityIndicator color="white" />
                ) : (
                <Text className="text-white font-bold text-lg">Register</Text>
                )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Have an account? </Text>
            <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                <Text className="text-blue-500 font-bold">Log in</Text>
                </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}