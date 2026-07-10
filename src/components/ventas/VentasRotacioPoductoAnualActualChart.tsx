import { useMemo } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { BarChart } from '@mui/x-charts/BarChart'
import { VentasMesesFrontend } from '../../types/inventario'
import { chart, axis } from '../../config/colors'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_KEYS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] as const;
const MONTH_COLORS = chart.monthColors

interface DistribucionVentaProps {
    selectedRow: VentasMesesFrontend | null;
}

export default function VentasRotacionProductoAnualActualChart({ selectedRow }: DistribucionVentaProps) {

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
            title={`Distribución mensual ${selectedRow ? `- ${selectedRow.Descripcion_Articulo || selectedRow.Ref_Articulo || selectedRow.Codigo_Articulo} (${selectedRow.Anio})` : ''}`}
            filters={<div className="h-6"></div>}
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
                                color: chart.barSeries,
                                id: 'sales',
                            },
                        ]}
                        xAxis={[
                            {
                                data: chartData.map((c) => c.name),
                                scaleType: 'band',
                                tickLabelStyle: { fontSize: 9, fill: axis.tickLabel },
                                colorMap: {
                                    type: 'ordinal',
                                    values: chartData.map((c) => c.name),
                                    colors: MONTH_COLORS,
                                },
                            },
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
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
                            '& .MuiChartsAxis-line': { stroke: axis.line },
                            '& .MuiChartsAxis-tick': { stroke: axis.line },
                            '& .MuiChartsGrid-line': { stroke: axis.grid, strokeDasharray: '4 3' },
                        }}
                    />
                )
            }
            legend={
                isEmpty ? (<></>) : (
                    <div className="flex justify-center mt-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                            Total Ventas:{' '}
                            {new Intl.NumberFormat('en-US', {
                                notation: 'compact',
                                compactDisplay: 'short',
                                maximumFractionDigits: 1,
                            }).format(chartData.reduce((sum, c) => sum + c.value, 0))}
                        </span>
                    </div>
                )
            }
        />
    )
}
