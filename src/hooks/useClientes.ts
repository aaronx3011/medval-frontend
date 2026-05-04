import { useState, useEffect } from 'react';
import { Cliente } from '../types/clientes';
import { clientesService } from '../services/clientesService';

export const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientes = async () => {
            setIsLoading(true);
            try {
                // Get the raw response from the service
                const response: any = await clientesService.getClientes();

                // --- THE FIX: Extract the array safely ---
                if (Array.isArray(response)) {
                    // Scenario A: The backend sends the array directly: [...]
                    setClientes(response);
                } else if (response && Array.isArray(response.data)) {
                    // Scenario B: The backend wraps it: { data: [...] }
                    setClientes(response.data);
                } else if (response && Array.isArray(response.clientes)) {
                    // Scenario C: The backend wraps it: { clientes: [...] }
                    setClientes(response.clientes);
                } else {
                    // Fallback
                    console.warn("Formato de clientes desconocido:", response);
                    setClientes([]);
                }

                setError(null);
            } catch (err: any) {
                setError(err.message);
                setClientes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientes();
    }, []);

    return { clientes, isLoading, error };
};



