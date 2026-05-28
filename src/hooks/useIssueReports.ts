import { useState, useEffect, useCallback } from 'react';
import { getIssueReports } from '../services/issueReportsService';
import { IssueReport } from '../types/issueReports';

export function useIssueReports() {
    const [data, setData] = useState<IssueReport[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getIssueReports();
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
