import { useState, useEffect } from 'react';
import { VentaProducto } from '../types/ventas';
import { fetchVentasPorProducto } from '../services/ventasProductosVendidos.ts'

export function useVentasProductos() {
    const [data, setData] = useState<VentaProducto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await fetchVentasPorProducto();
                if (isMounted) {
                    setData(result);
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
