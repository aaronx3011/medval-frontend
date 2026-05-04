import { motion } from 'framer-motion'
import { PieChart } from '@mui/x-charts/PieChart'
import { donutData } from '../../data/ventasData'

export default function RotacionAnualDonut() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: '0 8px 28px rgba(26,42,94,0.07)' }}
            className="chart-card"
        >
            <h3 className="text-sm font-bold text-brand-orange mb-3">
                Participacion en Rotacion Anual
            </h3>

            <PieChart
                height={240}
                series={[{
                    data: donutData.map((d, i) => ({
                        id: i,
                        value: d.value,
                        label: d.label,
                        color: d.color,
                    })),
                    innerRadius: 55,
                    outerRadius: 100,
                    paddingAngle: 1.5,
                    cornerRadius: 3,
                    valueFormatter: (item) => `${item.value.toFixed(2)}%`,
                    arcLabel: (item) => `${item.value.toFixed(1)}%`,
                    arcLabelMinAngle: 18,
                }]}
                slotProps={{ legend: { hidden: true } }}
                margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                sx={{
                    '& .MuiChartsArcLabel-root': { fontSize: '9px', fill: '#fff', fontWeight: 600 },
                }}
            />

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {donutData.map(d => (
                    <span key={d.label} className="flex items-center gap-1 text-[10px] text-slate-500">
                        <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                        {d.label}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}
