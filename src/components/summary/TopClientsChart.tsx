import { BarChart } from '@mui/x-charts/BarChart'
import GraphCard from '../utils/graphCard'
import { useTopClients } from '../../hooks/useTopClientes'
import { chart, axis } from '../../config/colors'

export default function TopClientsChart() {
    const { data, loading, error } = useTopClients();

    if (loading) return <GraphCard titlle=' Top Clientes Ventas ' graph={<div className="flex h-full items-center justify-center">Cargando...</div>} legend={<></>} />;
    if (error) return <GraphCard titlle=' Top Clientes Ventas ' graph={<div className="flex h-full items-center justify-center text-red-500">Error al cargar datos</div>} legend={<></>} />;

    const fullNames = data.map((c) => c.Nombre_Cliente)
    const totalSales = data.reduce((sum, c) => sum + c.Total_USD, 0)

    const formatTotal = (v: number) =>
        v >= 1000000
            ? `$${(v / 1000000).toFixed(1)}M`
            : v >= 1000
                ? `$${(v / 1000).toFixed(0)}K`
                : `$${v.toFixed(0)}`

    return (
        <GraphCard
            titlle=' Top Clientes Ventas '
            graph={
                <BarChart
                    series={[
                        {
                            data: data.map((c) => c.Total_USD),
                            color: chart.barSeries,
                            id: 'clients',
                        },
                    ]}
                    xAxis={[
                        {
                            data: fullNames,
                            scaleType: 'band',
                            tickLabelStyle: {
                                fontSize: 9,
                                fill: axis.tickLabel,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            },
                            colorMap: {
                                type: 'ordinal',
                                values: fullNames,
                                colors: chart.topClients,
                            },
                        },
                    ]}
                    yAxis={[
                        {
                            tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
                            valueFormatter: (v: number) => formatTotal(v),
                        },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                    margin={{ left: 56, right: 8, top: 8, bottom: 32 }}
                    borderRadius={6}
                    sx={{
                        '& .MuiChartsAxis-line': { stroke: axis.line },
                        '& .MuiChartsAxis-tick': { stroke: axis.tick },
                        '& .MuiChartsGrid-line': { stroke: axis.grid, strokeDasharray: '4 3' },
                    }}
                />
            }
            legend={
                <div className="flex justify-center mt-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        Total Ventas: {formatTotal(totalSales)}
                    </span>
                </div>
            }
        />
    )
}
