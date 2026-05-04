import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { getContrastColor } from '../../utils/getContrastColor'
import GraphCard from '../utils/graphCard'

interface ChartDataPoint {
    id: number;
    value: number;
    label: string;
    color: string;
}

interface Props {
    data: ChartDataPoint[];
}

export default function ArticuloVsVentas({ data = [] }: Props) {

    const total = data.reduce((s, d) => s + d.value, 0)

    return (
        <GraphCard
            titlle='Articulo VS Ventas'
            graph={
                <div className="relative w-full h-[220px] flex items-center justify-center">
                    {data.length > 0 && (
                        <PieChart
                            series={[{
                                data: data,
                                innerRadius: 65,
                                outerRadius: 95,
                                paddingAngle: 2,
                                cornerRadius: 4,
                                arcLabel: (item) => `${item.value.toFixed(0)}`,
                                arcLabelMinAngle: 25,
                            }]}
                            slotProps={{
                                legend: { hidden: true }
                            }}
                            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            sx={{
                                display: 'block',
                                margin: 'auto',
                                flexBasis: '100%',
                                // Styling the labels globally
                                [`& .${pieArcLabelClasses.root}`]: {
                                    fontSize: '10px',
                                    fontWeight: 700,
                                },
                                // Applying dynamic contrast colors per-slice index
                                ...data.reduce((acc, d, i) => ({
                                    ...acc,
                                    [`& .${pieArcLabelClasses.root}:nth-of-type(${i + 1})`]: {
                                        fill: getContrastColor(d.color),
                                    },
                                }), {}),
                            }}
                        />
                    )}

                    {/* Centered Total Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-xl font-extrabold text-slate-800 leading-none">
                            ${total.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-1">Total</p>
                    </div>
                </div>
            }
            legend={
                <div className="grid grid-cols-1 gap-2">
                    {data.map(d => (
                        <div key={d.label} className="flex items-center gap-3 text-[11px] text-slate-600">
                            <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ background: d.color }}
                            />
                            <span className="font-bold w-16 text-slate-800">
                                ${d.value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                            <span className="truncate max-w-[120px]">{d.label}</span>
                        </div>
                    ))}
                </div>
            }
            legendOrientation='vertical'
        />
    )
}
