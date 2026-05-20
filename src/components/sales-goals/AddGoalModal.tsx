import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createSalesGoal } from '../../services/salesGoalsService';

interface AddGoalModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const MONTHS = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => 2000 + i);

export default function AddGoalModal({ open, onClose, onSuccess }: AddGoalModalProps) {
    const [year, setYear] = useState<number>(currentYear);
    const [month, setMonth] = useState<number>(1);
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(goalAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('El monto debe ser un número positivo');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await createSalesGoal(year, month, amount);
            onSuccess();
            onClose();
            setGoalAmount('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear la meta');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-brand-navy">Agregar Meta</h2>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-page text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-navy mb-1">Año</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                                >
                                    {YEAR_OPTIONS.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-navy mb-1">Mes</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                                >
                                    {MONTHS.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-navy mb-1">Monto ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={goalAmount}
                                    onChange={(e) => setGoalAmount(e.target.value)}
                                    placeholder="50000.00"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-brand-navy hover:bg-surface-page transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
