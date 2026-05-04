import { useState, useEffect } from 'react';
import { InventarioDetalle } from '../types/inventario';
import { inventarioService } from '../services/inventarioService';

export function useInventarioDetalle() {
    const [data, setData] = useState<InventarioDetalle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await inventarioService.fetchInventarioDetalle();
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

        return () => { isMounted = false; };
    }, []);

    return { data, isLoading, error };
}
