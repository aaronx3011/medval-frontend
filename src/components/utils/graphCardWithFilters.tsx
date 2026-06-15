import { motion } from "framer-motion"
import { ReactElement, ReactNode } from "react"

interface graphCardWithFiltersProps {
    title: string,
    subtitle?: string,
    filters: ReactElement
    graph: ReactElement
    legend: ReactElement
    legendOrientation?: 'horizontal' | 'vertical'
    actions?: ReactNode
}

export default function GraphCardWithFilters({ title, subtitle, graph, legend, legendOrientation = 'horizontal', filters, actions }: graphCardWithFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: '0 8px 28px rgba(26,42,94,0.07)' }}
            className="chart-card flex flex-col h-full w-full p-4 bg-white rounded-xl"
        >
            <div className="flex items-start justify-between mb-2 flex-shrink-0">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-bold text-brand-orange uppercase tracking-wider">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>

            <div className="flex-shrink-0">
                {filters}
            </div>

            <div className={`flex flex-1 min-h-0 ${legendOrientation === 'vertical' ? 'flex-row items-center' : 'flex-col'}`}>

                {/* Added absolute inset-0 wrapper to the graph itself to trap the MUI Chart */}
                <div className={` ${legendOrientation === 'vertical' ? 'flex-[1.5]' : 'flex-[8]'} flex justify-center items-center w-full h-full relative`}>
                    <div className="absolute inset-0">
                        {graph}
                    </div>
                </div>

                <div className="flex-1 flex justify-center items-center w-full flex-shrink-0 mt-2">
                    {legend}
                </div>
            </div>
        </motion.div>
    )
}
