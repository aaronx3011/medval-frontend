import { useState, useEffect } from 'react';
import { AgrupadoProductoData } from '../types/ventas';
import { getAgrupadoProductoMensual } from '../services/ventasService';

export function useAgrupadoProductoMensual(
    startYear: string,
    startMonth: string,
    endYear: string,
    endMonth: string
) {
    const [data, setData] = useState<AgrupadoProductoData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if all 4 parameters are selected
        if (!startYear || !startMonth || !endYear || !endMonth) return;

        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await getAgrupadoProductoMensual(
                    parseInt(startYear, 10),
                    parseInt(startMonth, 10),
                    parseInt(endYear, 10),
                    parseInt(endMonth, 10)
                );

                if (isMounted) {
                    setData(result.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                    setData([]);
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
    }, [startYear, startMonth, endYear, endMonth]);

    return { data, isLoading, error };
}
