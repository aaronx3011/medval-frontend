import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import { getContrastColor } from '../../utils/getContrastColor';
import { formatCompact } from '../../utils/formatters';
import { chart } from '../../config/colors';

const COLORS = chart.topClientColors;

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
            subtitle='Histórico  ·  Acumulado ventas por cliente'
            filters={<></>}
            graph={
                    isLoading ? (
                        <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 font-medium">
                            Cargando...
                        </div>
                    ) : chartData.length > 0 ? (
                        <>
                            <PieChart
                                series={[{
                                    data: chartData,
                                    innerRadius: '60%',
                                    outerRadius: '85%',
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                    arcLabel: (item) => `$${formatCompact(item.value, 1)}`,
                                    arcLabelMinAngle: 35,
                                }]}
                                slotProps={{ legend: { hidden: true } }}
                                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: { fontSize: { xs: '7px', sm: '9px', md: '10px' }, fontWeight: 700 },
                                    ...chartData.reduce((acc, d, i) => ({
                                        ...acc,
                                        [`& .${pieArcLabelClasses.root}:nth-of-type(${i + 1})`]: {
                                            fill: getContrastColor(d.color),
                                        },
                                    }), {}),
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-800 leading-none px-1 truncate max-w-full">
                                    ${formatCompact(total, 1)}
                                </p>
                                <p className="text-[7px] sm:text-[9px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5">Total Top 5</p>
                            </div>
                        </>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 font-medium">
                            No hay datos disponibles
                        </div>
                    )
            }
            legend={
                <div className="grid grid-cols-1 gap-2">
                    {chartData.map(d => (
                        <div key={d.label} className="flex items-center gap-3 text-[11px] text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="font-bold w-12 text-slate-800">${formatCompact(d.value)}</span>
                            <span className="truncate max-w-[80px]">{d.label}</span>
                        </div>
                    ))}
                </div>
            }
            legendOrientation='vertical'
        />
    );
}
