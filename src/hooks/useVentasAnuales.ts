import { useState, useEffect } from 'react';
import { getVentasAnuales } from '../services/ventasService';
import { VentasAnualesResponse } from '../types/ventas';

export function useVentasAnuales(year: string | number) {
    const [data, setData] = useState<VentasAnualesResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getVentasAnuales(year);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year]);

    return { data, loading, error };
}
