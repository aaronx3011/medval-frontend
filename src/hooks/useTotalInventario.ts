import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import type { InventarioTotal, InventarioTotalResponse } from '../types/inventario';

export function useTotalInventario() {
    const [data, setData] = useState<InventarioTotal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setIsLoading(true);
                const json: InventarioTotalResponse = await apiClient('/inventario/total/');
                if (mounted) setData(json.data[0]);
            } catch (e: any) {
                if (mounted) setError(e.message);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, []);

    return { data, isLoading, error };
}
