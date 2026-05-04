import { useState, useEffect } from 'react';
import { DetalleProductoMensualFechasResponse } from '../types/ventas';
import { getDetalleProductoMensualFechas } from '../services/ventasService';

export function useDetalleProductoMensualFechas(
    startYear: string,
    startMonth: string,
    endYear: string,
    endMonth: string,
    producto: string | null
) {
    const [data, setData] = useState<DetalleProductoMensualFechasResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only trigger the API call if all parameters are present
        if (!startYear || !startMonth || !endYear || !endMonth || !producto) return;

        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await getDetalleProductoMensualFechas(
                    startYear, startMonth, endYear, endMonth, producto
                );

                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                    setData(null);
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
    }, [startYear, startMonth, endYear, endMonth, producto]);

    return { data, isLoading, error };
}
