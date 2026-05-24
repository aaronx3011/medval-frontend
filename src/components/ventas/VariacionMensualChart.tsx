import { useState, useMemo } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { BarChart } from '@mui/x-charts/BarChart'
import { useProductoMensual } from '../../hooks/useProductoMensual'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_COLORS = ['#0f1b3d', '#1a2a5e', '#243a7a', '#2e4a99', '#3a5fcc', '#4a7ae0', '#5a99f0', '#6ab8f5', '#7ac8ff', '#8ad8ff', '#9ae8ff', '#aad8ff']

interface DistribucionVentaProps {
    codigoArticulo: string;
}

export default function DistribucionVentaAnualPorProducto({ codigoArticulo }: DistribucionVentaProps) {
    const { data: apiResponse, loading, error } = useProductoMensual(codigoArticulo)
    const [selectedYear, setSelectedYear] = useState<string>('')

    // 1. Extract available years from the API data
    const availableYears = useMemo(() => {
        if (!apiResponse?.data || apiResponse.data.length === 0) return []
        const years = Array.from(new Set(apiResponse.data.map(d => d.Anio)))
        return years.sort((a, b) => b - a) // Sort descending
    }, [apiResponse])

    // 2. Set active year
    const activeYear = selectedYear ? parseInt(selectedYear) : (availableYears[0] || new Date().getFullYear())

    // 3. Client-side mapping for the 12 months (re-runs instantly when year changes)
    const chartData = useMemo(() => {
        const monthsData = MONTH_NAMES.map(name => ({ name, value: 0 }))

        if (apiResponse?.data) {
            const filteredData = apiResponse.data.filter(d => d.Anio === activeYear)

            filteredData.forEach(item => {
                if (item.Mes >= 1 && item.Mes <= 12) {
                    // Defaulting to Total_USD. Change to Total_Unidades or Total_VES if needed.
                    monthsData[item.Mes - 1].value = item.Total_USD
                }
            })
        }
        return monthsData
    }, [apiResponse, activeYear])

    // 4. Determine if there is actually any data to show
    const isEmpty = !apiResponse?.data || apiResponse.data.length === 0;

    return (
        <GraphCardWithFilters
            title='Distribución de ventas anuales por producto'
            filters={
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Elige un periodo:</span>
                    <select
                        value={activeYear}
                        onChange={e => setSelectedYear(e.target.value)}
                        disabled={loading || isEmpty}
                        className="h-6 px-2 rounded-full border border-slate-200 bg-slate-50 outline-none cursor-pointer disabled:opacity-50"
                    >
                        {availableYears.length > 0 ? (
                            availableYears.map(y => <option key={y} value={y}>{y}</option>)
                        ) : (
                            <option value="">Sin datos</option>
                        )}
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
                        Error cargando datos: {error}
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        No hay datos de ventas disponibles para este producto.
                    </div>
                ) : (
                    <BarChart
                        series={[
                            {
                                data: chartData.map((c) => c.value),
                                color: '#3d5a99',
                                id: 'clients',
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
                loading || error || isEmpty ? (<></>) : (
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
