import { useState, useMemo } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { BarChart } from '@mui/x-charts/BarChart'
import { useVentasMensuales } from '../../hooks/useVentasMensuales'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_COLORS = ['#0f1b3d', '#1a2a5e', '#243a7a', '#2e4a99', '#3a5fcc', '#4a7ae0', '#5a99f0', '#6ab8f5', '#7ac8ff', '#8ad8ff', '#9ae8ff', '#aad8ff']

export default function VariacionMensualChart() {
    const { data: apiResponse, loading, error } = useVentasMensuales()
    const [selectedYear, setSelectedYear] = useState<string>('')

    // 1. Dynamically extract all available years from the fetched data
    const availableYears = useMemo(() => {
        if (!apiResponse?.data) return []
        const years = Array.from(new Set(apiResponse.data.map(d => d.Anio)))
        return years.sort((a, b) => b - a) // Sort descending (newest first)
    }, [apiResponse])

    // 2. Determine the active year to display (default to the newest available year)
    const activeYear = selectedYear ? parseInt(selectedYear) : (availableYears[0] || new Date().getFullYear())

    // 3. Client-side filter: Instantly maps the data for the active year into a 12-month array
    const chartData = useMemo(() => {
        // Initialize an array with 12 months set to 0
        const monthsData = MONTH_NAMES.map(name => ({ name, value: 0 }))

        if (apiResponse?.data) {
            // Filter by the selected year
            const filteredData = apiResponse.data.filter(d => d.Anio === activeYear)

            // Populate the specific months that have data
            filteredData.forEach(item => {
                // item.Mes is 1-indexed (1 = Jan), so we subtract 1 for the array index
                if (item.Mes >= 1 && item.Mes <= 12) {
                    // I'm using Total_USD here, but you can change this to Total_VES or Total_Unidades
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
                                // ADD THIS: Formats large numbers to compact notation (e.g., 150000 -> 150K)
                                valueFormatter: (value) =>
                                    new Intl.NumberFormat('en-US', {
                                        notation: 'compact',
                                        compactDisplay: 'short',
                                        maximumFractionDigits: 1
                                    }).format(value)
                            },
                        ]}
                        slotProps={{ legend: { hidden: true } }}
                        // CHANGE THIS: Increase the left margin from 36 to something like 60 or 70
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
                loading ? (<></>) :
                    error ? (<></>) : (


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
