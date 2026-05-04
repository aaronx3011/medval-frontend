import { useState, useEffect } from 'react';
import { AnalisisReposicionResponse } from '../types/inventario';
import { inventarioService } from '../services/inventarioService';

export const useAnalisisReposicion = () => {
    const [data, setData] = useState<AnalisisReposicionResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await inventarioService.getAnalisisReposicion();
                setData(response);
                setError(null);
            } catch (err: any) {
                setError(err.message);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
};
