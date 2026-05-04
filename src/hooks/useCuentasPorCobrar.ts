import { useState, useEffect } from 'react';
import { getCuentasPorCobrar, fetchCuentasPorCobrar2 } from '../services/cuentasPorCobrarService';
import { CuentaPorCobrar, CuentaPorCobrar2 } from '../types/cuentasPorCobrar';


export const useCuentasPorCobrar = () => {
    const [data, setData] = useState<CuentaPorCobrar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getCuentasPorCobrar();

                // Ordenar la tabla por Deuda_Total_USD de mayor a menor
                const sortedData = result.data.sort((a, b) => {
                    const deudaA = a.Deuda_Total_USD ?? 0;
                    const deudaB = b.Deuda_Total_USD ?? 0;
                    return deudaB - deudaA;
                });

                setData(sortedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};





export function useCuentasPorCobrar2() {
    const [data, setData] = useState<CuentaPorCobrar2[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await fetchCuentasPorCobrar2();
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
