import { useMemo } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { LineChart } from '@mui/x-charts/LineChart'
import { useVentasMensuales } from '../../hooks/useVentasMensuales'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const YEAR_COLORS = [
    '#1a2a5e',
    '#FF6600',
    '#16a34a',
    '#9333ea',
    '#e11d48',
    '#0891b2',
]

export default function LineAllYearsByMonth() {
    const { data: apiResponse, loading, error } = useVentasMensuales()

    // 1. Extract all available years sorted descending
    const availableYears = useMemo(() => {
        if (!apiResponse?.data) return []
        const years = Array.from(new Set(apiResponse.data.map(d => d.Anio)))
        return years.sort((a, b) => b - a)
    }, [apiResponse])

    // 2. Build one series per year — each is a 12-slot array (null for missing months)
    const series = useMemo(() => {
        if (!apiResponse?.data || availableYears.length === 0) return []

        return availableYears.map((year, i) => {
            const monthsData: (number | null)[] = Array(12).fill(null)

            apiResponse.data
                .filter(d => d.Anio === year)
                .forEach(item => {
                    if (item.Mes >= 1 && item.Mes <= 12) {
                        monthsData[item.Mes - 1] = item.Total_USD
                    }
                })

            return {
                data: monthsData,
                label: year.toString(),
                color: YEAR_COLORS[i % YEAR_COLORS.length],
                showMark: false,
                curve: 'monotoneX' as const,
                area: false,
            }
        })
    }, [apiResponse, availableYears])

    return (
        <GraphCardWithFilters
            title='Evolución de ventas por año'
            filters={
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                    USD — todos los años
                </span>
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
                    <LineChart
                        series={series}
                        xAxis={[{
                            data: MONTH_NAMES,
                            scaleType: 'point',
                            tickLabelStyle: { fontSize: 9, fill: '#9ca3af' },
                            sx: {
                                '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                                '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                            }
                        }]}
                        yAxis={[{
                            tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                            valueFormatter: (value) =>
                                new Intl.NumberFormat('en-US', {
                                    notation: 'compact',
                                    compactDisplay: 'short',
                                    maximumFractionDigits: 1
                                }).format(value)
                        }]}
                        slotProps={{ legend: { hidden: true } }}
                        margin={{ left: 60, right: 12, top: 8, bottom: 32 }}
                        grid={{ horizontal: true }}
                        sx={{
                            '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                            '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                            '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                        }}
                    />
                )
            }
            legend={
                !loading && !error ? (
                    <div className="flex items-center justify-center">
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            {availableYears.map((year, i) => (
                                <span key={year} className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <span
                                        className="w-5 h-0.5 rounded inline-block flex-shrink-0"
                                        style={{ background: YEAR_COLORS[i % YEAR_COLORS.length] }}
                                    />
                                    {year}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : <></>
            }
        />
    )
}
