import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { IssueReport } from '../../types/issueReports';
import { updateIssueReportStatus } from '../../services/issueReportsService';

const SEVERITY_COLORS: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
};

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
    open: { label: 'Abierto', color: 'bg-red-100 text-red-700' },
    in_review: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-700' },
    resolved: { label: 'Resuelto', color: 'bg-green-100 text-green-700' },
};

const STATUS_OPTIONS = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_review', label: 'En Revisión' },
    { value: 'resolved', label: 'Resuelto' },
];

export default function IssueReportList({ reports, onRefresh }: { reports: IssueReport[]; onRefresh: () => void }) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (reports.length === 0) {
        return (
            <div className="chart-card">
                <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase mb-4">Historial de Reportes</h2>
                <p className="text-sm text-slate-400 text-center py-8">No hay reportes enviados</p>
            </div>
        );
    }

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateIssueReportStatus(id, newStatus);
            onRefresh();
        } catch {
            // silently fail
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <div className="chart-card">
            <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase mb-4">Historial de Reportes</h2>
            <div className="-mx-5 sm:mx-0 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="w-8 py-3 px-1" />
                            <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Fecha</th>
                            <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Título</th>
                            <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Reportó</th>
                            <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Severidad</th>
                            <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.id} className="border-b border-slate-50 hover:bg-surface-muted transition-colors">
                                <td className="py-3 px-1">
                                    <button
                                        onClick={() => toggleExpand(report.id)}
                                        className="p-0.5 rounded text-slate-400 hover:text-brand-navy transition-colors"
                                    >
                                        {expandedId === report.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                </td>
                                <td className="py-3 px-4 sm:px-2 text-slate-500 whitespace-nowrap text-xs">
                                    {new Date(report.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })}
                                </td>
                                <td className="py-3 px-4 sm:px-2 text-brand-navy font-medium whitespace-nowrap max-w-[200px] truncate">
                                    {report.title}
                                </td>
                                <td className="py-3 px-4 sm:px-2 text-slate-600 whitespace-nowrap text-xs">
                                    {report.reporter_name}
                                </td>
                                <td className="py-3 px-4 sm:px-2 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${SEVERITY_COLORS[report.severity] ?? 'bg-slate-100 text-slate-600'}`}>
                                        {report.severity}
                                    </span>
                                </td>
                                <td className="py-3 px-4 sm:px-2 whitespace-nowrap">
                                    <select
                                        value={report.status}
                                        onChange={e => handleStatusChange(report.id, e.target.value)}
                                        className={`text-xs font-medium rounded-lg border-0 px-2 py-1 cursor-pointer focus:ring-2 focus:ring-brand-orange/30 ${STATUS_STYLES[report.status]?.color ?? 'bg-slate-100 text-slate-600'}`}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {expandedId !== null && (
                <div className="mx-2 mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100 max-h-[200px] overflow-y-auto">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Descripción</p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {reports.find(r => r.id === expandedId)?.description ?? ''}
                    </p>
                </div>
            )}
        </div>
    );
}
