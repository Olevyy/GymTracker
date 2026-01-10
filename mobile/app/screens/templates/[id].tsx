// Edit existing template
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getTemplateById, updateTemplate } from '@/services/templateService';
import TemplateForm from '@/components/templates/templateForm';

export default function EditTemplateScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getTemplateById(Number(id));
                
                const formattedExercises = data.exercises.map(ex => ({
                    exercise: {
                        id: ex.exercise_id,
                        name: ex.exercise_name,
                        primary_muscles: [],
                        image_urls: []
                    },
                    sets_count: ex.sets_count
                }));

                setInitialData({
                    name: data.name,
                    notes: data.notes,
                    exercises: formattedExercises
                });
            } catch (error) {
                Alert.alert("Error", "Failed to load template");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleUpdate = async (data: any) => {
        try {
            await updateTemplate(Number(id), data);
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to update routine");
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top']}>
            <TemplateForm 
                initialName={initialData.name}
                initialNotes={initialData.notes}
                initialExercises={initialData.exercises}
                submitLabel="Update"
                onSubmit={handleUpdate}
                onCancel={() => router.back()}
            />
        </SafeAreaView>
    );
}