import { motion } from 'framer-motion'
import { BarChart } from '@mui/x-charts/BarChart'
import { rankingData } from '../../data/ventasData'

const BAR_COLORS = [
    '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0',
    '#fde047', '#fbbf24', '#fb923c', '#f87171', '#fca5a5',
    '#fecaca', '#fee2e2',
]

export default function RankingEficiencia() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: '0 8px 28px rgba(26,42,94,0.07)' }}
            className="chart-card"
        >
            <h3 className="text-sm font-bold text-brand-orange mb-3">
                Ranking de Productos por Eficiencia
            </h3>

            <BarChart
                height={260}
                layout="horizontal"
                series={[{
                    data: rankingData.map(d => d.efficiency),
                    label: 'Eficiencia',
                    color: '#22c55e',
                    id: 'efficiency',
                }]}
                yAxis={[{
                    data: rankingData.map(d => d.product),
                    scaleType: 'band',
                    tickLabelStyle: { fontSize: 9, fill: '#6b7280' },
                    colorMap: {
                        type: 'ordinal',
                        values: rankingData.map(d => d.product),
                        colors: BAR_COLORS,
                    },
                }]}
                xAxis={[{
                    label: 'Eficiencia (Rotacion / Precio)',
                    tickLabelStyle: { fontSize: 9, fill: '#9ca3af' },
                    labelStyle: { fontSize: 10, fill: '#6b7280' },
                }]}
                slotProps={{ legend: { hidden: true } }}
                margin={{ left: 64, right: 16, top: 8, bottom: 48 }}
                borderRadius={4}
                sx={{
                    '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                    '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                    '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                }}
            />
        </motion.div>
    )
}
