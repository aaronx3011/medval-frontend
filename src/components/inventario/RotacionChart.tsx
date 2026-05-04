import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart } from '@mui/x-charts/LineChart'
import { MONTHS, PRODUCTS, PRODUCT_COLORS, rotacionData } from '../../data/ventasData'

const MONTHS_LIST = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const YEARS = ['2025', '2026']

export default function RotacionChart() {
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chart-card mb-4"
        >
            <div className="flex flex-col items-center gap-2 mb-4">
                <h3 className="font-display text-xl font-bold text-brand-orange">
                    Rotacion por Producto
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>Elige un periodo:</span>
                    <select
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        className="h-7 px-3 rounded-full border border-slate-200 bg-slate-50 text-xs
                       outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                    >
                        <option value="">Elige un mes</option>
                        {MONTHS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        className="h-7 px-3 rounded-full border border-slate-200 bg-slate-50 text-xs
                       outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                    >
                        <option value="">Elige un año</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            <LineChart
                height={320}
                series={PRODUCTS.map((prod, i) => ({
                    data: rotacionData[prod],
                    label: prod,
                    color: PRODUCT_COLORS[i],
                    showMark: true,
                    curve: 'catmullRom' as const,
                }))}
                xAxis={[{
                    data: MONTHS,
                    scaleType: 'band',
                    tickLabelStyle: { fontSize: 11, fill: '#6b7280' },
                }]}
                yAxis={[{
                    tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                    valueFormatter: (v: number) => v.toLocaleString(),
                }]}
                slotProps={{ legend: { hidden: true } }}
                margin={{ left: 64, right: 16, top: 12, bottom: 12 }}
                sx={{
                    '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                    '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                    '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                }}
            />

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                {PRODUCTS.map((prod, i) => (
                    <span key={prod} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span
                            className="inline-block w-5 h-0.5 rounded flex-shrink-0"
                            style={{ background: PRODUCT_COLORS[i] }}
                        />
                        {prod}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}
