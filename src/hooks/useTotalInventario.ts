import { useState, useEffect } from 'react';
import { InventarioTotal } from '../types/inventario';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function useTotalInventario() {
    const [data, setData] = useState<InventarioTotal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_BASE_URL}/inventario/total/`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const json = await res.json();
                if (mounted) setData(json.data[0]);
            } catch (e: any) {
                if (mounted) setError(e.message);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, []);

    return { data, isLoading, error };
}
