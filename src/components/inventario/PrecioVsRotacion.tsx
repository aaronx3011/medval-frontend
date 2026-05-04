import { motion } from 'framer-motion'
import { ScatterChart } from '@mui/x-charts/ScatterChart'
import { scatterData } from '../../data/ventasData'

export default function PrecioVsRotacion() {
    const main = scatterData.filter(d => d.rotation < 500)

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: '0 8px 28px rgba(26,42,94,0.07)' }}
            className="chart-card"
        >
            <h3 className="text-sm font-bold text-brand-orange mb-3">
                Relacion Precio vs Rotacion
            </h3>

            <ScatterChart
                height={260}
                series={[{
                    data: main.map((d, i) => ({ x: d.price, y: d.rotation, id: d.product + i })),
                    label: 'Productos',
                    color: '#ef4444',
                    markerSize: 6,
                }]}
                xAxis={[{
                    label: 'Precio (base)',
                    tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                    labelStyle: { fontSize: 11, fill: '#6b7280' },
                }]}
                yAxis={[{
                    label: 'Rotacion',
                    tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                    labelStyle: { fontSize: 11, fill: '#6b7280' },
                }]}
                slotProps={{ legend: { hidden: true } }}
                margin={{ left: 56, right: 16, top: 12, bottom: 48 }}
                sx={{
                    '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                    '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                    '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                }}
            />
        </motion.div>
    )
}
