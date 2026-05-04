import { useState, useEffect } from 'react';
import { getVentasMensuales } from '../services/ventasMensualesService';
import { VentasMensualesResponse } from '../types/ventas';

export function useVentasMensuales() {
    const [data, setData] = useState<VentasMensualesResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getVentasMensuales();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
}
