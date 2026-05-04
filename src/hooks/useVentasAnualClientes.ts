import { useState, useEffect } from 'react';
import { VentasAnualCliente } from '../types/ventas';
import { ventasService } from '../services/ventasService';

export const useVentasAnualClientes = () => {
    const [data, setData] = useState<VentasAnualCliente[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await ventasService.getVentasAnualClientes();
                setData(response.data || []);
                setError(null);
            } catch (err: any) {
                setError(err.message);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, isLoading, error };
};
