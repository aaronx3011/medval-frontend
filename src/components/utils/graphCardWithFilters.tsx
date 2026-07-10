import { motion } from "framer-motion"
import { ReactElement } from "react"
import { component } from "../../config/colors"

interface graphCardWithFiltersProps {
    title: string,
    subtitle?: string,
    actions?: ReactElement,
    filters: ReactElement
    graph: ReactElement
    legend: ReactElement
    legendOrientation?: 'horizontal' | 'vertical'
}

export default function GraphCardWithFilters({ title, subtitle, actions, graph, legend, legendOrientation = 'horizontal', filters }: graphCardWithFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: component.cardShadow }}
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
                {actions && <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>}
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
