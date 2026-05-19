import { useMemo } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { BarChart } from '@mui/x-charts/BarChart'
import { VentasMesesFrontend } from '../../types/inventario'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_KEYS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] as const;
const MONTH_COLORS = ['#0f1b3d', '#1a2a5e', '#243a7a', '#2e4a99', '#3a5fcc', '#4a7ae0', '#5a99f0', '#6ab8f5', '#7ac8ff', '#8ad8ff', '#9ae8ff', '#aad8ff']

interface DistribucionVentaProps {
    selectedRow: VentasMesesFrontend | null;
}

export default function VentasRotacionProductoAnualActualChart({ selectedRow }: DistribucionVentaProps) {

    // Mapeamos los datos de la fila directamente al formato del gráfico
    const chartData = useMemo(() => {
        if (!selectedRow) return []

        return MONTH_NAMES.map((name, index) => {
            const key = MONTH_KEYS[index];
            return {
                name,
                value: selectedRow[key] || 0
            }
        });
    }, [selectedRow])

    const isEmpty = !selectedRow;

    return (
        <GraphCardWithFilters
            title={`Distribución mensual ${selectedRow ? `- ${selectedRow.Descripcion_Articulo || selectedRow.Codigo_Articulo} (${selectedRow.Anio})` : ''}`}
            filters={<div className="h-6"></div>} // Espacio vacío para mantener aliganción del layout
            graph={
                isEmpty ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Selecciona un artículo en la tabla para ver su distribución
                    </div>
                ) : (
                    <BarChart
                        series={[
                            {
                                data: chartData.map((c) => c.value),
                                color: '#3d5a99',
                                id: 'sales',
                            },
                        ]}
                        xAxis={[
                            {
                                data: chartData.map((c) => c.name),
                                scaleType: 'band',
                                tickLabelStyle: { fontSize: 9, fill: '#9ca3af' },
                                colorMap: {
                                    type: 'ordinal',
                                    values: chartData.map((c) => c.name),
                                    colors: MONTH_COLORS,
                                },
                            },
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                                valueFormatter: (value) =>
                                    new Intl.NumberFormat('en-US', {
                                        notation: 'compact',
                                        compactDisplay: 'short',
                                        maximumFractionDigits: 1
                                    }).format(value)
                            },
                        ]}
                        slotProps={{ legend: { hidden: true } }}
                        margin={{ left: 60, right: 8, top: 8, bottom: 32 }}
                        borderRadius={6}
                        sx={{
                            '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                            '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                            '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                        }}
                    />
                )
            }
            legend={
                isEmpty ? (<></>) : (
                    <div className='flex items-center justify-center'>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            {chartData.map((c, i) => (
                                <span key={c.name} className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <span
                                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                        style={{ background: MONTH_COLORS[i] }}
                                    />
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            }
        />
    )
}
