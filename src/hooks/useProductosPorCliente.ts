import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import type { ClientePorProducto2, ClientesPorProductoResponse2 } from '../types/ventas';

export function useProductosPorCliente(codigoCliente: string | undefined) {
    const [data, setData] = useState<ClientePorProducto2[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!codigoCliente) {
            setData([]);
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const json: ClientesPorProductoResponse2 = await apiClient(`/ventas/producto-por-cliente/${codigoCliente}`);
                if (isMounted) {
                    setData(json.data);
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
    }, [codigoCliente]);

    return { data, isLoading, error };
}
