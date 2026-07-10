import { motion } from 'framer-motion'
import { ScatterChart } from '@mui/x-charts/ScatterChart'
import { chart, component, axis } from '../../config/colors'
import { scatterData } from '../../data/ventasData'

export default function PrecioVsRotacion() {
    const main = scatterData.filter(d => d.rotation < 500)

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: `0 8px 28px ${component.cardShadow}` }}
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
                    color: chart.scatter,
                    markerSize: 6,
                }]}
                xAxis={[{
                    label: 'Precio (base)',
                    tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
                    labelStyle: { fontSize: 11, fill: axis.label },
                }]}
                yAxis={[{
                    label: 'Rotacion',
                    tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
                    labelStyle: { fontSize: 11, fill: axis.label },
                }]}
                slotProps={{ legend: { hidden: true } }}
                margin={{ left: 56, right: 16, top: 12, bottom: 48 }}
                sx={{
                    '& .MuiChartsAxis-line': { stroke: axis.line },
                    '& .MuiChartsAxis-tick': { stroke: axis.line },
                    '& .MuiChartsGrid-line': { stroke: axis.grid, strokeDasharray: '4 3' },
                }}
            />
        </motion.div>
    )
}
