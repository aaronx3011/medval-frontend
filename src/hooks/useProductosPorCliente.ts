import { useState, useEffect } from 'react';
import { ClientePorProducto2, ClientesPorProductoResponse2 } from '../types/ventas';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
                const response = await fetch(
                    `${API_BASE_URL}/ventas/producto-por-cliente/${codigoCliente}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json: ClientesPorProductoResponse2 = await response.json();
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
