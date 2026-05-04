import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import GraphCard from '../utils/graphCard';
import { useVentasMensuales } from '../../hooks/useVentasMensuales';

const GOAL = 120000;

export default function MonthlySalesChart() {
    const { data, loading, error } = useVentasMensuales();

    const lastMonth = data?.data
        ? [...data.data].sort((a, b) => {
            if (b.Anio !== a.Anio) return b.Anio - a.Anio;
            return b.Mes - a.Mes;
        })[0]
        : null;

    const currentUSD = lastMonth?.Total_USD ?? 0;
    const currentK = Math.round(currentUSD / 1000);
    const goalK = Math.round(GOAL / 1000);

    const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthLabel = lastMonth
        ? `${MONTH_NAMES[lastMonth.Mes - 1]} ${lastMonth.Anio}`
        : '';

    return (
        <GraphCard
            titlle='Progreso de meta mensual'
            graph={
                loading ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Cargando...
                    </div>
                ) : error ? (
                    <div className="flex h-full w-full items-center justify-center text-red-400 text-sm">
                        Error cargando datos
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
                                fill: currentK >= goalK ? '#16a34a' : '#1a2a5e',
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
                                style={{ background: currentK >= goalK ? '#16a34a' : '#1a2a5e' }}
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
