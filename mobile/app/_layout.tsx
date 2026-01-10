import "../global.css"; 
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { WorkoutProvider } from "@/contexts/WorkoutContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <WorkoutProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" /> 
            </Stack>
            </WorkoutProvider>
        </AuthProvider>
    );
}