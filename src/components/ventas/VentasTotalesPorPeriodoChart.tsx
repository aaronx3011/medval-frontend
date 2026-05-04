import { LineChart } from '@mui/x-charts/LineChart'
import { dailyChartData } from '../../data/mockData'
import GraphCard from '../utils/graphCard'

interface VentasTotalesPorPeriodoChartProps {
    product: string

}


export default function VentasTotalesPorPeriodoChart({ product }: VentasTotalesPorPeriodoChartProps) {
    const xLabels = dailyChartData.map((d) => String(d.day))
    const metasDiarias = dailyChartData.map((d) => d.metasDiarias)

    return (


        <GraphCard
            titlle={product}
            graph={
                <LineChart
                    series={[
                        {
                            data: metasDiarias,
                            label: 'Monto Vendido',
                            color: '#e96c2a',
                            showMark: false,
                            area: true,
                            curve: 'catmullRom',
                        },
                    ]}
                    xAxis={[
                        {
                            data: xLabels,
                            scaleType: 'band',
                            tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                            tickInterval: (_val: unknown, i: number) => i % 5 === 0,
                        },
                    ]}
                    yAxis={[
                        {
                            tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                            valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
                        },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                    margin={{ left: 52, right: 12, top: 8, bottom: 28 }}
                    sx={{
                        '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                        '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                        '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                    }}
                />

            }
            legend={


                <div className='flex items-center justify-center'>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="w-5 h-0.5 bg-brand-orange inline-block rounded" />
                            Periodo seleccionado
                        </span>
                    </div>
                </div>


            }

        />

    )
}
