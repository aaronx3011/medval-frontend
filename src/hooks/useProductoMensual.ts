import { useState, useEffect } from 'react';
import { getDetalleProductoMensual } from '../services/productoMensualService';
import { ProductoMensualResponse } from '../types/ventas';

export function useProductoMensual(codigoArticulo: string) {
    const [data, setData] = useState<ProductoMensualResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!codigoArticulo) return; // Prevent fetch if code is empty

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getDetalleProductoMensual(codigoArticulo);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [codigoArticulo]); // Re-fetch if the product code changes

    return { data, loading, error };
}
