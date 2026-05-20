import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { useSalesGoals } from '../hooks/useSalesGoals';
import { updateSalesGoal } from '../services/salesGoalsService';
import { SalesGoal } from '../types/salesGoals';
import AddGoalModal from '../components/sales-goals/AddGoalModal';

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function ConfigurationPage() {
    const { data: goals, loading, error, refetch } = useSalesGoals();
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [savingEdit, setSavingEdit] = useState(false);

    const sortedGoals = useMemo(() => {
        if (!goals) return [];
        return [...goals].sort((a, b) => b.year - a.year || b.month - a.month);
    }, [goals]);

    const currentGoal = sortedGoals[0] ?? null;

    const handleStartEdit = (goal: SalesGoal) => {
        setEditingId(goal.id);
        setEditValue(goal.goal_amount.toString());
    };

    const handleSaveEdit = async (id: number) => {
        const amount = parseFloat(editValue);
        if (isNaN(amount) || amount <= 0) return;
        setSavingEdit(true);
        try {
            await updateSalesGoal(id, amount);
            setEditingId(null);
            refetch();
        } catch {
        } finally {
            setSavingEdit(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <h1 className="text-xl sm:text-2xl font-bold text-brand-navy mb-6">Configuración</h1>

            {/* Current Goal Section */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="kpi-card mb-6"
            >
                <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase mb-4">Meta Actual</h2>

                {loading && <p className="text-sm text-slate-500">Cargando...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {!loading && !error && !currentGoal && (
                    <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">No hay metas configuradas</p>
                        <button
                            onClick={() => setAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                            <Plus size={16} />
                            Agregar Meta
                        </button>
                    </div>
                )}

                {!loading && !error && currentGoal && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="w-full sm:w-auto sm:flex-1">
                            <label className="block text-xs text-slate-500 mb-1">Periodo</label>
                            <p className="text-sm font-medium text-brand-navy">
                                {MONTH_NAMES[currentGoal.month - 1]} {currentGoal.year}
                            </p>
                        </div>
                        <div className="w-full sm:w-auto sm:flex-1">
                            <label className="block text-xs text-slate-500 mb-1">Monto ($)</label>
                            {editingId === currentGoal.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 min-w-0 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleSaveEdit(currentGoal.id)}
                                        disabled={savingEdit}
                                        className="shrink-0 p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="shrink-0 p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-surface-page transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-bold text-brand-navy">
                                        ${currentGoal.goal_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <button
                                        onClick={() => handleStartEdit(currentGoal)}
                                        className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-surface-page transition-colors"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Historical Goals Section */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="chart-card"
            >
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase">Historial de Metas</h2>
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-orange text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={14} />
                        <span className="hidden sm:inline">Agregar Meta</span>
                    </button>
                </div>

                {loading && <p className="text-sm text-slate-500">Cargando...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {!loading && !error && sortedGoals.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">No hay metas registradas</p>
                )}

                {!loading && !error && sortedGoals.length > 0 && (
                    <div className="-mx-5 sm:mx-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Año</th>
                                    <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Mes</th>
                                    <th className="text-right py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Monto ($)</th>
                                    <th className="text-right py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedGoals.map((goal) => (
                                    <tr key={goal.id} className="border-b border-slate-50 hover:bg-surface-muted transition-colors">
                                        <td className="py-3 px-4 sm:px-2 text-brand-navy font-medium whitespace-nowrap">{goal.year}</td>
                                        <td className="py-3 px-4 sm:px-2 text-slate-600 whitespace-nowrap">{MONTH_NAMES[goal.month - 1]}</td>
                                        <td className="py-3 px-4 sm:px-2 text-right text-brand-navy font-medium whitespace-nowrap">
                                            {editingId === goal.id ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-20 sm:w-28 rounded-lg border border-slate-200 px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEdit(goal.id)}
                                                        disabled={savingEdit}
                                                        className="shrink-0 p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <Check size={12} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="shrink-0 p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-surface-page transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span>${goal.goal_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 sm:px-2 text-right whitespace-nowrap">
                                            {editingId !== goal.id && (
                                                <button
                                                    onClick={() => handleStartEdit(goal)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-surface-page transition-colors"
                                                    title="Editar meta"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <AddGoalModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSuccess={refetch}
            />
        </motion.main>
    );
}
