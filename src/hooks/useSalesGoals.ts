import { useState, useEffect, useCallback } from 'react';
import { getAllSalesGoals } from '../services/salesGoalsService';
import { SalesGoal } from '../types/salesGoals';

export function useSalesGoals() {
    const [data, setData] = useState<SalesGoal[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllSalesGoals();
            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
