import { motion } from "framer-motion"
import { ReactElement } from "react"
import { component } from "../../config/colors"

interface TableCardProps {
    title: string,
    subtitle?: string,
    graph: ReactElement
    legend: ReactElement
    legendOrientation?: string
}

export default function TableCard({ title, subtitle, graph, legend, legendOrientation = 'horizontal' }: TableCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: component.cardShadow }}
            className="chart-card flex flex-col h-full w-full"
        >
            <div className="flex-[1] flex items-start justify-between min-h-0 flex-col gap-0.5">
                <h3 className="text-l font-bold text-brand-orange uppercase">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[11px] text-slate-400 font-medium mb-2">{subtitle}</p>
                )}
            </div>

            {legendOrientation == 'vertical' ?
                (

                    <div className="flex justify-center flex-row">

                        <div className="flex-[9] min-h-0 w-full pt-6">
                            {graph}
                        </div>

                        <div className="flex-[1] flex justify-center items-center min-h-0 w-full">
                            {legend}
                        </div>

                    </div>
                ) :
                (
                    <>
                        <div className="flex-[8] min-h-0 w-full pt-6">
                            {graph}
                        </div>

                        <div className="flex-[1] flex justify-center items-center min-h-0 w-full">
                            {legend}
                        </div>
                    </>
                )


            }
        </motion.div >
    )
}
