import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createSalesGoal } from '../../services/salesGoalsService';

interface AddGoalModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function AddGoalModal({ open, onClose, onSuccess }: AddGoalModalProps) {
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d+(\.\d{1,2})?$/.test(goalAmount)) {
            setError('Solo se permiten números');
            return;
        }
        const amount = parseFloat(goalAmount);
        if (amount <= 0) {
            setError('El monto debe ser un número positivo');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await createSalesGoal(currentYear, currentMonth, amount);
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
                        className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-brand-navy">Crear Meta</h2>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-page text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                            Meta para {MONTH_NAMES[currentMonth - 1]} {currentYear}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    autoFocus
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
                                    className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-amber-500 transition-colors disabled:opacity-50"
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
