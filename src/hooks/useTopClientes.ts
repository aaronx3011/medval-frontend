import { useState, useEffect } from 'react';
import { getTopClients } from '../services/ventasService.ts';
import { ClientSalesData } from '../types/ventas.ts';

export const useTopClients = () => {
    const [data, setData] = useState<ClientSalesData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTopClients()
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { data, loading, error };
};
