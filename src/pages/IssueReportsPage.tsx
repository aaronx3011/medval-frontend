import { motion } from 'framer-motion';
import { useIssueReports } from '../hooks/useIssueReports';
import IssueReportForm from '../components/system/IssueReportForm';
import IssueReportList from '../components/system/IssueReportList';

export default function IssueReportsPage() {
    const { data: reports, loading, error, refetch } = useIssueReports();

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <h1 className="text-xl sm:text-2xl font-bold text-brand-navy mb-6">Reportar Problema</h1>

            <div className="space-y-6 max-w-3xl">
                <IssueReportForm onSuccess={refetch} />

                {loading && <p className="text-sm text-slate-500">Cargando historial...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && !error && <IssueReportList reports={reports ?? []} onRefresh={refetch} />}
            </div>
        </motion.main>
    );
}
