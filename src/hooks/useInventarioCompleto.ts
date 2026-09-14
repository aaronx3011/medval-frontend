import { useState, useEffect } from 'react';
import type { InventarioItem, InventoryMetadata } from '../types/inventario';
import { inventarioService } from '../services/inventarioService';

export function useInventarioCompleto() {
    const [data, setData] = useState<InventarioItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<InventoryMetadata | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await inventarioService.fetchInventarioCompleto();
                if (isMounted) {
                    setData(result.data);
                    setMetadata(result.metadata);
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

    return { data, metadata, isLoading, error };
}
