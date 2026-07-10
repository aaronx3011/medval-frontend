import { PieChart } from '@mui/x-charts/PieChart';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import { chart } from '../../config/colors';

const SOFT_COLORS = chart.softColors;

interface VentasAnualCliente {
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Total_USD: number;
}

interface Props {
    data: VentasAnualCliente[];
    isLoading: boolean;
}

export default function ClientesConMenorCompraChart({ data, isLoading }: Props) {
    const total = data.reduce((s, d) => s + d.Total_USD, 0);

    const chartData = data.map((d, i) => ({
        id: i,
        value: d.Total_USD,
        label: d.Nombre_Cliente,
        color: SOFT_COLORS[i % SOFT_COLORS.length]
    }));

    return (
        <GraphCardWithFilters
            title='Top 5 Clientes (Menor Compra)'
            filters={<span className="text-[10px] text-slate-400 font-bold uppercase">Acumulado Anual</span>}
            graph={
                <div className="relative w-full h-[250px] flex items-center justify-center">
                    {isLoading ? (
                        <p className="text-xs text-slate-400">Cargando...</p>
                    ) : chartData.length > 0 ? (
                        <>
                            <PieChart
                                series={[{
                                    data: chartData,
                                    innerRadius: '60%',
                                    outerRadius: '85%',
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                }]}
                                slotProps={{ legend: { hidden: true } }}
                                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-lg font-extrabold text-slate-800 leading-none">
                                    ${total.toFixed(0)}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-1">Total Bottom 5</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-slate-400">No hay datos disponibles</p>
                    )}
                </div>
            }
            legend={
                <div className="grid grid-cols-1 gap-2">
                    {chartData.map(d => (
                        <div key={d.label} className="flex items-center gap-3 text-[10px] text-slate-600">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="font-bold w-14 text-slate-800">${d.value.toFixed(2)}</span>
                            <span className="truncate max-w-[200px]" title={d.label}>{d.label}</span>
                        </div>
                    ))}
                </div>
            }
            legendOrientation='vertical'
        />
    );
}
