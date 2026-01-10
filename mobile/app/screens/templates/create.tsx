// Create new template screen add exercise using exercisesSelector
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createTemplate } from '@/services/templateService';
import TemplateForm from '@/components/templates/templateForm';
import { Alert } from 'react-native';

export default function CreateTemplateScreen() {
    const router = useRouter();

    const handleCreate = async (data: any) => {
        try {
            await createTemplate(data);
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to create routine");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            <TemplateForm 
                submitLabel="Save"
                onSubmit={handleCreate}
                onCancel={() => router.back()}
            />
        </SafeAreaView>
    );
}