import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import GraphCard from '../utils/graphCard';
import { useVentasMensuales } from '../../hooks/useVentasMensuales';
import { useSalesGoals } from '../../hooks/useSalesGoals';
import { brand, status } from '../../config/colors';

export default function MonthlySalesChart() {
    const { data, loading, error } = useVentasMensuales();
    const { data: goals, loading: goalsLoading } = useSalesGoals();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const currentGoal = goals?.find(g => g.year === currentYear && g.month === currentMonth) ?? null;
    const goalAmount = currentGoal?.goal_amount ?? 0;
    const hasGoal = goalAmount > 0;

    const lastMonth = data?.data
        ? [...data.data].sort((a, b) => {
            if (b.Anio !== a.Anio) return b.Anio - a.Anio;
            return b.Mes - a.Mes;
        })[0]
        : null;

    const currentUSD = lastMonth?.Total_USD ?? 0;
    const currentK = Math.round(currentUSD / 1000);
    const goalK = Math.round(goalAmount / 1000);

    const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthLabel = lastMonth
        ? `${MONTH_NAMES[lastMonth.Mes - 1]} ${lastMonth.Anio}`
        : '';

    const gaugeColor = currentK >= goalK ? status.success : brand.navy;

    return (
        <GraphCard
            titlle='Progreso de meta mensual'
            graph={
                loading || goalsLoading ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Cargando...
                    </div>
                ) : error ? (
                    <div className="flex h-full w-full items-center justify-center text-red-400 text-sm">
                        Error cargando datos
                    </div>
                ) : !hasGoal ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Sin meta configurada
                    </div>
                ) : (
                    <Gauge
                        value={currentK}
                        valueMax={goalK}
                        startAngle={-110}
                        endAngle={110}
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 36,
                                transform: 'translate(0px, 0px)',
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: gaugeColor,
                            },
                        }}
                        text={() => `${currentK}K / ${goalK}K`}
                    />
                )
            }
            legend={
                !loading && !error && lastMonth ? (
                    <div className="flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span
                                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                style={{ background: gaugeColor }}
                            />
                            ${currentUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400">{monthLabel}</span>
                    </div>
                ) : <></>
            }
        />
    );
}
