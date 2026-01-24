// Storages exercises data, handles filtering and pagination
import { useState, useEffect } from 'react';
import { getExercises } from '@/services/exercisesService';
import { Exercise, Muscle, Level, Category } from '@/types/exercise';

export function useExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters 
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

    // Reset list when ANY filter changes
    useEffect(() => {
        resetAndFetch();
    }, [searchQuery, selectedMuscle, selectedCategory, selectedLevel]);

    const resetAndFetch = () => {
        setPage(1);
        setHasMore(true);
        setExercises([]); 
        fetchData(1, true); 
    };

    const fetchData = async (pageNum: number, isReset: boolean) => {
        setLoading(true);
        try {
            const response = await getExercises({ 
                page: pageNum, 
                search: searchQuery,
                muscle: selectedMuscle || undefined,
                level: selectedLevel || undefined,
                category: selectedCategory || undefined
            });

            setExercises(prev => isReset ? response.results : [...prev, ...response.results]);
            setHasMore(!!response.next); 
        } catch (err: any) {
            console.error(err);            
            setHasMore(false); // Prevent further load more attempts on error
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchData(nextPage, false);
        }
    };

    return {
        exercises,
        loading,
        searchQuery, setSearchQuery,
        selectedMuscle, setSelectedMuscle,
        selectedCategory, setSelectedCategory,
        selectedLevel, setSelectedLevel,
        loadMore,
        refresh: resetAndFetch
    };
}