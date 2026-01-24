import "../global.css"; 
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import CustomAlert, { setAlertHandler } from '@/components/main/CustomAlert';

function AppContent() {
    const [alertState, setAlertState] = useState<{
        visible: boolean;
        title: string;
        message: string;
        buttons?: any[];
    }>({
        visible: false,
        title: '',
        message: '',
        buttons: []
    });

    const showAlert = (title: string, message: string, buttons?: any[]) => {
        setAlertState({ visible: true, title, message, buttons });
    };

    const closeAlert = () => {
        setAlertState({ ...alertState, visible: false });
    };

    // Set the global alert handler
    React.useEffect(() => {
        setAlertHandler(showAlert);
    }, []);

    return (
        <>
            <AuthProvider>
                <WorkoutProvider>
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" /> 
                </Stack>
                </WorkoutProvider>
            </AuthProvider>
            <CustomAlert
                visible={alertState.visible}
                title={alertState.title}
                message={alertState.message}
                buttons={alertState.buttons}
                onClose={closeAlert}
            />
        </>
    );
}

export default function RootLayout() {
    return <AppContent />;
}