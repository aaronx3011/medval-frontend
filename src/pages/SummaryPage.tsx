import { motion } from 'framer-motion'

import KpiRow from '../components/KpiRow'
import TopClientsChart from '../components/summary/TopClientsChart'
import NotificationsPanel from '../components/summary/NotificationsPanel'
import MonthlySalesChart from '../components/summary/MonthlySalesChart'
import CuentasPorCobrarSummary from '../components/summary/CuentasPorCobrarSummary'


export default function SummaryPage() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full h-full overflow-y-auto p-4 lg:p-6"
        >
            {/* KPI row */}
            <KpiRow />

            {/* Mid row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="min-h-[300px] lg:min-h-[380px]">
                    <NotificationsPanel />
                </div>
                <div className="min-h-[300px] lg:min-h-[380px]">
                    <MonthlySalesChart />
                </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="min-h-[400px] lg:min-h-[440px]">
                    <CuentasPorCobrarSummary />
                </div>
                <div className="min-h-[300px] lg:min-h-[440px]">
                    <TopClientsChart />
                </div>
            </div>
        </motion.main>
    )
}



