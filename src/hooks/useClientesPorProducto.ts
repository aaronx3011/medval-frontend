import { useState, useEffect } from 'react';
import { ClientePorProducto } from '../types/ventas';
import { ventasService } from '../services/ventasService';

export const useClientesPorProducto = (codigoProducto: string) => {
    const [data, setData] = useState<ClientePorProducto[]>([]);
    const [totals, setTotals] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Si no hay producto seleccionado, limpiamos la data
        if (!codigoProducto) {
            setData([]);
            setTotals(null);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Llamada limpia al servicio
                const result = await ventasService.getClientesPorProducto(codigoProducto);

                setData(result.data || []);
                setTotals(result.totals || null);
                setError(null);
            } catch (err: any) {
                setError(err.message);
                setData([]);
                setTotals(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [codigoProducto]); // Se vuelve a ejecutar cada vez que cambia el código del producto

    return { data, totals, isLoading, error };
};
