import { useState, useEffect } from 'react';
import { DetalleVentasClienteMensual } from '../types/clientes';
import { ventasClientesService } from '../services/clientesService';

export const useDetalleVentasCliente = (codigoCliente: string | undefined) => {
    const [data, setData] = useState<DetalleVentasClienteMensual[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Si no hay cliente seleccionado, vaciamos la gráfica
        if (!codigoCliente) {
            setData([]);
            return;
        }

        const fetchDetalle = async () => {
            setIsLoading(true);
            try {
                const response = await ventasClientesService.getDetalleMensualCliente(codigoCliente);

                // Extraemos el arreglo 'data' que viene en la respuesta de tu API
                if (response && Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    setData([]);
                }

                setError(null);
            } catch (err: any) {
                setError(err.message);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetalle();
    }, [codigoCliente]);

    return { data, isLoading, error };
};
