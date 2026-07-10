import { useState, useMemo } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { BarChart } from '@mui/x-charts/BarChart'
import { useVentasMensuales } from '../../hooks/useVentasMensuales'
import { chart, axis } from '../../config/colors'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_COLORS = chart.monthColors

export default function VariacionMensualChart() {
    const { data: apiResponse, loading, error } = useVentasMensuales()
    const [selectedYear, setSelectedYear] = useState<string>('')

    const availableYears = useMemo(() => {
        if (!apiResponse?.data) return []
        const years = Array.from(new Set(apiResponse.data.map(d => d.Anio)))
        return years.sort((a, b) => b - a)
    }, [apiResponse])

    const activeYear = selectedYear ? parseInt(selectedYear) : (availableYears[0] || new Date().getFullYear())

    const chartData = useMemo(() => {
        const monthsData = MONTH_NAMES.map(name => ({ name, value: 0 }))

        if (apiResponse?.data) {
            const filteredData = apiResponse.data.filter(d => d.Anio === activeYear)

            filteredData.forEach(item => {
                if (item.Mes >= 1 && item.Mes <= 12) {
                    monthsData[item.Mes - 1].value = item.Total_USD
                }
            })
        }
        return monthsData
    }, [apiResponse, activeYear])

    return (
        <GraphCardWithFilters
            title='Distribución de ventas anuales'
            filters={
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Elige un periodo:</span>
                    <select
                        value={activeYear}
                        onChange={e => setSelectedYear(e.target.value)}
                        disabled={loading || availableYears.length === 0}
                        className="h-6 px-2 rounded-full border border-slate-200 bg-slate-50 outline-none cursor-pointer disabled:opacity-50"
                    >
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            }
            graph={
                loading ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Cargando gráfico...
                    </div>
                ) : error ? (
                    <div className="flex h-full w-full items-center justify-center text-red-400 text-sm">
                        Error cargando datos
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
                loading || error ? (<></>) : (
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
