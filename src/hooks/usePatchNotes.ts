import { useState, useEffect, useCallback } from 'react';
import { getAllPatchNotes } from '../services/patchNotesService';
import { PatchNote } from '../types/patchNotes';

export function usePatchNotes() {
    const [data, setData] = useState<PatchNote[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllPatchNotes();
            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
