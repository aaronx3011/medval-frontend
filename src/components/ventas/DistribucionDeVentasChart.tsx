import { useMemo } from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { getContrastColor } from '../../utils/getContrastColor'
import { formatCompact } from '../../utils/formatters'
import GraphCard from '../utils/graphCard'
import { ClientePorProducto } from '../../types/ventas'

// Brand colors for the top 5 clients
const TOP_COLORS = ['#0F172A', '#334155', '#64748B', '#94A3B8', '#E2E8F0']
const OTHERS_COLOR = '#FF6600' // Neutral slate for "Otros"

interface Props {
    data: ClientePorProducto[];
    period?: string;
    selectedProductName?: string;
}

export default function DistribucionDeVentasChart({ data = [], period, selectedProductName }: Props) {

    // Logic for Top 5 + Otros
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // 1. Sort clients descending by Total_USD
        const sortedClients = [...data].sort((a, b) => Number(b.Total_USD) - Number(a.Total_USD));

        // 2. Separate Top 5 and the rest
        const top5 = sortedClients.slice(0, 5);
        const theRest = sortedClients.slice(5);

        // 3. Map Top 5 to the chart format
        const formattedData = top5.map((client, index) => ({
            id: index,
            label: client.Nombre_Cliente,
            value: Number(client.Total_USD),
            color: TOP_COLORS[index % TOP_COLORS.length]
        }));

        // 4. Sum up the rest into an "Otros" slice
        if (theRest.length > 0) {
            const othersTotal = theRest.reduce((sum, client) => sum + Number(client.Total_USD), 0);
            formattedData.push({
                id: 5,
                label: 'Otros Clientes',
                value: othersTotal,
                color: OTHERS_COLOR
            });
        }

        return formattedData;
    }, [data]);

    const total = chartData.reduce((s, d) => s + d.value, 0)

    const subtitle = period && selectedProductName
        ? `${period}  ·  ${selectedProductName}`
        : period || ''

    return (
        <GraphCard
            titlle='Distribución de Ventas por Cliente'
            subtitle={subtitle}
            graph={
                <div className="relative w-full h-full flex items-center justify-center">
                    {chartData.length > 0 ? (
                        <PieChart
                            series={[{
                                data: chartData,
                                innerRadius: '55%',
                                outerRadius: '80%',
                                paddingAngle: 2,
                                cornerRadius: 4,
                                arcLabel: (item) => `$${formatCompact(item.value, 1)}`,
                                arcLabelMinAngle: 25,
                            }]}
                            slotProps={{ legend: { hidden: true } }}
                            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                    fontSize: { xs: '7px', sm: '9px', md: '10px' },
                                    fontWeight: 700,
                                },
                                ...chartData.reduce((acc, d, i) => ({
                                    ...acc,
                                    [`& .${pieArcLabelClasses.root}:nth-of-type(${i + 1})`]: {
                                        fill: getContrastColor(d.color),
                                    },
                                }), {}),
                            }}
                        />
                    ) : (
                        <p className="text-xs text-slate-400 font-medium">Seleccione un producto</p>
                    )}

                    {chartData.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-800 leading-none px-1 truncate max-w-full">
                                ${formatCompact(total, 1)}
                            </p>
                            <p className="text-[7px] sm:text-[9px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5">Total</p>
                        </div>
                    )}
                </div>
            }
            legend={
                <div className="grid grid-cols-1 gap-2">
                    {chartData.map(d => (
                        <div key={d.label} className="flex items-center gap-3 text-[11px] text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="font-bold w-12 text-slate-800">
                                ${formatCompact(d.value)}
                            </span>
                            <span className="truncate max-w-[80px]">{d.label}</span>
                        </div>
                    ))}
                </div>
            }
            legendOrientation='vertical'
        />
    )
}
