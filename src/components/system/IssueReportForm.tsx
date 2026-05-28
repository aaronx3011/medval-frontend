import { useState } from 'react';
import { createIssueReport } from '../../services/issueReportsService';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

export default function IssueReportForm({ onSuccess }: { onSuccess: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reporterName, setReporterName] = useState('');
    const [reporterEmail, setReporterEmail] = useState('');
    const [severity, setSeverity] = useState('Medium');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!title.trim() || !description.trim() || !reporterName.trim() || !reporterEmail.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail.trim())) {
            setError('Correo electrónico inválido');
            return;
        }

        setSubmitting(true);
        try {
            await createIssueReport({
                title: title.trim(),
                description: description.trim(),
                reporter_name: reporterName.trim(),
                reporter_email: reporterEmail.trim(),
                severity,
            });
            setTitle('');
            setDescription('');
            setReporterName('');
            setReporterEmail('');
            setSeverity('Medium');
            setSuccess(true);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar el reporte');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chart-card">
            <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase mb-4">Reportar un Problema</h2>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
                    Reporte enviado correctamente. ¡Gracias por tu ayuda!
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Nombre</label>
                    <input
                        type="text"
                        value={reporterName}
                        onChange={e => setReporterName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                        placeholder="Tu nombre"
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Correo</label>
                    <input
                        type="email"
                        value={reporterEmail}
                        onChange={e => setReporterEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                        placeholder="tu@correo.com"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs text-slate-500 mb-1">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="Resumen del problema"
                />
            </div>

            <div className="mb-4">
                <label className="block text-xs text-slate-500 mb-1">Severidad</label>
                <div className="flex gap-2">
                    {SEVERITIES.map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setSeverity(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                                severity === s
                                    ? 'bg-brand-orange text-white border-brand-orange'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-orange'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs text-slate-500 mb-1">Descripción</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                    placeholder="Describe el problema en detalle..."
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
                {submitting ? 'Enviando...' : 'Enviar Reporte'}
            </button>
        </form>
    );
}
