import { motion } from "framer-motion"
import { ReactElement } from "react"
import { component } from "../../config/colors"

interface graphCardProps {
    titlle: string,
    subtitle?: string,
    graph: ReactElement
    legend: ReactElement
    legendOrientation?: 'horizontal' | 'vertical' | string
}

export default function GraphCard({ titlle, subtitle, graph, legend, legendOrientation = 'horizontal' }: graphCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: component.cardShadow }}
            className="chart-card flex flex-col h-full w-full"
        >
            {/* Header section */}
            <div className="flex-shrink-0 flex items-start justify-between mb-2 min-h-0 flex-col gap-0.5">
                <h3 className="text-l font-bold text-brand-orange uppercase">
                    {titlle}
                </h3>
                {subtitle && (
                    <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
                )}
            </div>

            {/* Main Graph & Legend Container */}
            <div className={`flex flex-1 min-h-0 ${legendOrientation === 'vertical' ? 'flex-row items-center' : 'flex-col'}`}>

                {/* Graph Wrapper - Traps the MUI Chart to force responsive sizing */}
                <div className={`${legendOrientation === 'vertical' ? 'flex-[1.5]' : 'flex-[8]'} relative w-full h-full flex justify-center items-center`}>
                    <div className="absolute inset-0">
                        {graph}
                    </div>
                </div>

                {/* Legend Wrapper */}
                <div className="flex-1 flex justify-center items-center w-full flex-shrink-0 min-h-0">
                    {legend}
                </div>
            </div>

        </motion.div>
    )
}
