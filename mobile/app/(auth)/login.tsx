import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {Image} from 'react-native';
import { customAlert } from '@/components/main/CustomAlert';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { checkAuth } = useAuth(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      customAlert('Error', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(username, password);
      await checkAuth();
      // After login, navigate to main app
      router.replace('/(tabs)'); 
      
    } catch (error: any) {
      customAlert('Login error', 'Check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="items-center mb-10">
          <Image
            source={require('@/assets/images/ic_launcher_foreground.png')}
            style={{ 
            width: 110,
            height: 110,

            }}

          />
          <Text className="text-white text-3xl font-bold mt-4">Lightweight</Text>
          <Text className="text-gray-400 text-base mt-2">Welcome again bro 🐗</Text>
        </View>

        <View className="space-y-4">
          {/* Username Input */}
          <View>
            <Text className="text-gray-400 mb-2 ml-1">Username</Text>
            <TextInput
              className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-blue-500"
              placeholder="Your username"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Password Input */}
          <View className="mt-4">
            <Text className="text-gray-400 mb-2 ml-1">Password</Text>
            <TextInput
              className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 focus:border-blue-500"
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-blue-600 p-4 rounded-xl mt-6 items-center ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Log in</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-bold">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}