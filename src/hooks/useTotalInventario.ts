import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import type { InventarioTotal, InventarioTotalResponse, InventoryMetadata } from '../types/inventario';

export function useTotalInventario() {
    const [data, setData] = useState<InventarioTotal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<InventoryMetadata | null>(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setIsLoading(true);
                const json: InventarioTotalResponse = await apiClient('/inventario/total/');
                if (mounted) {
                    setData(json.data[0]);
                    setMetadata(json.metadata);
                }
            } catch (e: any) {
                if (mounted) setError(e.message);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, []);

    return { data, metadata, isLoading, error };
}
