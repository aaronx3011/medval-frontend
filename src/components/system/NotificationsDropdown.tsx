import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from '../Icons';
import { usePatchNotes } from '../../hooks/usePatchNotes';
import { useIssueReports } from '../../hooks/useIssueReports';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    'New Feature': { label: 'Nueva Funcionalidad', color: 'bg-green-100 text-green-700' },
    'Bugfix': { label: 'Corrección', color: 'bg-red-100 text-red-700' },
    'Improvement': { label: 'Mejora', color: 'bg-blue-100 text-blue-700' },
};

const SEVERITY_COLORS: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
    open: 'Abierto',
    in_review: 'En Revisión',
    resolved: 'Resuelto',
};

export default function NotificationsDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: patchNotes, loading: notesLoading, error: notesError } = usePatchNotes();
    const { data: issueReports, loading: issuesLoading, error: issuesError } = useIssueReports();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const recentNotes = patchNotes?.slice(0, 5) ?? [];
    const openIssues = issueReports?.filter(i => i.status === 'open' || i.status === 'in_review').slice(0, 5) ?? [];
    const totalCount = recentNotes.length + openIssues.length;

    return (
        <div ref={ref} className="relative">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setOpen(prev => !prev)}
                className="relative w-11 h-11 rounded-full bg-surface-page flex items-center justify-center
                    text-brand-navy hover:bg-surface-page transition-colors flex-shrink-0"
            >
                <BellIcon size={24} />
                {totalCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center border-2 border-white px-1">
                        {totalCount > 9 ? '9+' : totalCount}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-brand-navy">Notificaciones</h3>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {recentNotes.length > 0 && (
                                <div className="p-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-1">Notas de Parche</h4>
                                    <div className="space-y-1">
                                        {recentNotes.map(note => (
                                            <button
                                                key={note.id}
                                                onClick={() => { setOpen(false); navigate('/configuration/patch-notes'); }}
                                                className="w-full text-left p-2 rounded-xl hover:bg-surface-page transition-colors"
                                            >
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${CATEGORY_LABELS[note.category]?.color ?? 'bg-slate-100 text-slate-600'}`}>
                                                        {CATEGORY_LABELS[note.category]?.label ?? note.category}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{note.version}</span>
                                                </div>
                                                <p className="text-xs font-medium text-brand-navy truncate">{note.title}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => { setOpen(false); navigate('/configuration/patch-notes'); }}
                                        className="mt-1 w-full text-xs text-brand-orange font-medium text-center py-1.5 hover:underline"
                                    >
                                        Ver todas →
                                    </button>
                                </div>
                            )}

                            {openIssues.length > 0 && (
                                <div className={`p-3 ${recentNotes.length > 0 ? 'border-t border-slate-100' : ''}`}>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-1">
                                        Issues Abiertos ({issueReports?.filter(i => i.status !== 'resolved').length ?? 0})
                                    </h4>
                                    <div className="space-y-1">
                                        {openIssues.map(issue => (
                                            <button
                                                key={issue.id}
                                                onClick={() => { setOpen(false); navigate('/configuration/issues'); }}
                                                className="w-full text-left p-2 rounded-xl hover:bg-surface-page transition-colors"
                                            >
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${SEVERITY_COLORS[issue.severity] ?? 'bg-slate-100 text-slate-600'}`}>
                                                        {issue.severity}
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${issue.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {STATUS_LABELS[issue.status] ?? issue.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-brand-navy truncate">{issue.title}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{issue.reporter_name}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => { setOpen(false); navigate('/configuration/issues'); }}
                                        className="mt-1 w-full text-xs text-brand-orange font-medium text-center py-1.5 hover:underline"
                                    >
                                        Ver todas →
                                    </button>
                                </div>
                            )}

                            {notesLoading || issuesLoading ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-slate-400">Cargando...</p>
                                </div>
                            ) : notesError || issuesError ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-red-400">Error al cargar notificaciones</p>
                                    <p className="text-xs text-slate-400 mt-1">{notesError || issuesError}</p>
                                </div>
                            ) : recentNotes.length === 0 && openIssues.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-slate-400">No hay notificaciones</p>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
