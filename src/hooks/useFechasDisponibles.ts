import { useState, useEffect } from 'react';
import { FechaDisponible } from '../types/ventas';
import { getFechasDisponibles } from '../services/ventasService';

export function useFechasDisponibles() {
    const [data, setData] = useState<FechaDisponible[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await getFechasDisponibles();
                if (isMounted) {
                    setData(result.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, isLoading, error };
}
