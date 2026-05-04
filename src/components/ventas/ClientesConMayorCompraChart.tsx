import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import { getContrastColor } from '../../utils/getContrastColor';

const COLORS = ['#0F172A', '#FF6600', '#334155', '#64748B', '#94A3B8'];

interface VentasAnualCliente {
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Total_USD: number;
}

interface Props {
    data: VentasAnualCliente[];
    isLoading: boolean;
}

export default function ClientesConMayorCompraChart({ data, isLoading }: Props) {
    const total = data.reduce((s, d) => s + d.Total_USD, 0);

    const chartData = data.map((d, i) => ({
        id: i,
        value: d.Total_USD,
        label: d.Nombre_Cliente,
        color: COLORS[i % COLORS.length]
    }));

    return (
        <GraphCardWithFilters
            title='Top 5 Clientes (Mayor Compra)'
            filters={<span className="text-[10px] text-slate-400 font-bold uppercase">Acumulado Anual</span>}
            graph={
                <div className="relative w-full h-[250px] flex items-center mt-14 justify-center">
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
                                    arcLabel: (item) => `$${(item.value / 1000).toFixed(0)}k`,
                                    arcLabelMinAngle: 35,
                                }]}
                                slotProps={{ legend: { hidden: true } }}
                                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: { fontSize: '9px', fontWeight: 700 },
                                    ...chartData.reduce((acc, d, i) => ({
                                        ...acc,
                                        [`& .${pieArcLabelClasses.root}:nth-of-type(${i + 1})`]: {
                                            fill: getContrastColor(d.color),
                                        },
                                    }), {}),
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-lg font-extrabold text-slate-800 leading-none">
                                    ${(total / 1000).toFixed(1)}k
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-1">Total Top 5</p>
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
                            <span className="font-bold w-14 text-slate-800">${d.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                            <span className="truncate max-w-[200px]" title={d.label}>{d.label}</span>
                        </div>
                    ))}
                </div>
            }
            legendOrientation='vertical'
        />
    );
}
