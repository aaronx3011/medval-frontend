import { BarChart } from '@mui/x-charts/BarChart'
import GraphCard from '../utils/graphCard'
import { useTopClients } from '../../hooks/useTopClientes' // Adjust path accordingly

const CLIENT_COLORS = [
    '#1a2a5e', '#2d3f7a', '#3d5a99', '#5b7fcc',
    '#7a9de0', '#99baf0', '#b8d3f5', '#cce0ff',
]

export default function TopClientsChart() {
    const { data, loading, error } = useTopClients();

    if (loading) return <GraphCard titlle=' Top Clientes Ventas ' graph={<div className="flex h-full items-center justify-center">Cargando...</div>} legend={<></>} />;
    if (error) return <GraphCard titlle=' Top Clientes Ventas ' graph={<div className="flex h-full items-center justify-center text-red-500">Error al cargar datos</div>} legend={<></>} />;

    return (
        <GraphCard
            titlle=' Top Clientes Ventas '
            graph={
                <BarChart
                    series={[
                        {
                            data: data.map((c) => c.Total_USD),
                            color: '#3d5a99',
                            id: 'clients',
                        },
                    ]}
                    xAxis={[
                        {
                            data: data.map((c) => c.Nombre_Cliente),
                            scaleType: 'band',
                            tickLabelStyle: { fontSize: 9, fill: '#9ca3af' },
                            colorMap: {
                                type: 'ordinal',
                                values: data.map((c) => c.Nombre_Cliente),
                                colors: CLIENT_COLORS,
                            },
                        },
                    ]}
                    yAxis={[
                        {
                            tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                        },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                    margin={{ left: 36, right: 8, top: 8, bottom: 32 }}
                    borderRadius={6}
                    sx={{
                        '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                        '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                        '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                    }}
                />
            }
            legend={
                <div className='flex items-center justify-center'>
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
                        {data.map((c, i) => (
                            <span key={c.Codigo_Cliente} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <span
                                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                    style={{ background: CLIENT_COLORS[i % CLIENT_COLORS.length] }}
                                />
                                {c.Codigo_Cliente}
                            </span>
                        ))}
                    </div>
                </div>
            }
        />
    )
}
