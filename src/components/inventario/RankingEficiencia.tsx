import { motion } from 'framer-motion'
import { BarChart } from '@mui/x-charts/BarChart'
import { chart, component, status, axis } from '../../config/colors'
import { rankingData } from '../../data/ventasData'

const BAR_COLORS = chart.rankingEfficiency

export default function RankingEficiencia() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: `0 8px 28px ${component.cardShadow}` }}
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
                    color: status.successLight,
                    id: 'efficiency',
                }]}
                yAxis={[{
                    data: rankingData.map(d => d.product),
                    scaleType: 'band',
                    tickLabelStyle: { fontSize: 9, fill: axis.label },
                    colorMap: {
                        type: 'ordinal',
                        values: rankingData.map(d => d.product),
                        colors: BAR_COLORS,
                    },
                }]}
                xAxis={[{
                    label: 'Eficiencia (Rotacion / Precio)',
                    tickLabelStyle: { fontSize: 9, fill: axis.tickLabel },
                    labelStyle: { fontSize: 10, fill: axis.label },
                }]}
                slotProps={{ legend: { hidden: true } }}
                margin={{ left: 64, right: 16, top: 8, bottom: 48 }}
                borderRadius={4}
                sx={{
                    '& .MuiChartsAxis-line': { stroke: axis.line },
                    '& .MuiChartsAxis-tick': { stroke: axis.line },
                    '& .MuiChartsGrid-line': { stroke: axis.grid, strokeDasharray: '4 3' },
                }}
            />
        </motion.div>
    )
}
