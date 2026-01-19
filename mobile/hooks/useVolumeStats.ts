import { useState, useEffect, useMemo } from 'react';
import { getVolumeStats, VolumeStatsResponse } from '@/services/workoutService';
import { Muscle } from '@/types/exercise';

export const useVolumeStats = () => {
    // --- STATE ---
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<VolumeStatsResponse | null>(null);
    const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
    const [focusedBar, setFocusedBar] = useState<{value: number, label: string} | null>(null);

    // --- FETCHING ---
    const fetchData = async () => {
        if (!data) setLoading(true);
        try {
            const stats = await getVolumeStats(selectedMuscle);
            setData(stats);
            setFocusedBar(null); 
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMuscle]);

    // --- LOGIC & TRANSFORMATIONS ---
    
    // For muscle filter
    const muscleList = useMemo(() => Object.values(Muscle), []);

    // OY Axis Config
    const yAxisConfig = useMemo(() => {
        if (!data?.chart || data.chart.length === 0) return { maxValue: 100, noOfSections: 4 };
        
        const maxVal = Math.max(...data.chart.map(d => d.value));
        if (maxVal === 0) return { maxValue: 100, noOfSections: 4 };

        const sections = 4;
        let roughStep = maxVal / sections;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const normalizedStep = roughStep / magnitude;

        let niceStep;
        if (normalizedStep <= 1) niceStep = 1;
        else if (normalizedStep <= 2) niceStep = 2;
        else if (normalizedStep <= 5) niceStep = 5;
        else niceStep = 10;

        const stepValue = niceStep * magnitude;
        return { maxValue: stepValue * sections, noOfSections: sections };
    }, [data]);

    // Chart Data with colors and handlers
    const chartData = useMemo(() => {
        if (!data?.chart) return [];
        
        return data.chart.map((item) => {
            // If the bar is focused
            const isFocused = focusedBar?.label === item.label;

            return {
                value: item.value,
                label: item.label,
                
                frontColor: isFocused 
                    ? '#FBBF24' 
                    : (item.value > 0 ? '#3B82F6' : '#1F2937'),
                
                labelTextStyle: { color: '#9CA3AF', fontSize: 12 },
                onPress: () => {
                    setFocusedBar({
                        value: item.value,
                        label: item.label
                    });
                }
            };
        });
    }, [data, focusedBar]); 

    return {
        loading,
        data,
        chartData,
        yAxisConfig,
        muscleList,
        selectedMuscle,
        focusedBar,
        setSelectedMuscle,
        setFocusedBar
    };
};