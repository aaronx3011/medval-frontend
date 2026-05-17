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
    isLoading: boolean;
}

export default function TopProductosMenosVendidos({ data, isLoading }: Props) {
    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <GraphCard
            titlle='Top 5 productos menos vendidos'
            graph={
                <div className="relative w-full h-full flex items-center justify-center">
                    {isLoading ? (
                        <p className="text-xs text-slate-400">Cargando...</p>
                    ) : data.length > 0 ? (
                        <>
                            <PieChart
                                series={[{
                                    data,
                                    innerRadius: '55%',
                                    outerRadius: '80%',
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                    arcLabel: (item) => `$${item.value.toFixed(0)}`,
                                    arcLabelMinAngle: 25,
                                }]}
                                slotProps={{ legend: { hidden: true } }}
                                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: { fontSize: { xs: '7px', sm: '9px', md: '10px' }, fontWeight: 700 },
                                    ...data.reduce((acc, d, i) => ({
                                        ...acc,
                                        [`& .${pieArcLabelClasses.root}:nth-of-type(${i + 1})`]: {
                                            fill: getContrastColor(d.color),
                                        },
                                    }), {}),
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-800 leading-none px-1 truncate max-w-full">
                                    ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-[7px] sm:text-[9px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5">Total Bottom 5</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-slate-400">No hay datos</p>
                    )}
                </div>
            }
            legend={
                <div className="grid grid-cols-1 gap-2">
                    {data.map(d => (
                        <div key={d.label} className="flex items-center gap-3 text-[11px] text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="font-bold w-12 text-slate-800">
                                ${d.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
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
