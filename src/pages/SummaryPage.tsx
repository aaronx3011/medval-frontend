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
            className="flex flex-col w-full h-full overflow-y-auto p-6"
        >
            {/* KPI row */}
            <KpiRow />

            {/* Mid row: line chart + top clients */}
            <div className="h-[40%] grid grid-cols-2 gap-4 mb-4">
                <NotificationsPanel />
                <MonthlySalesChart />
            </div>

            {/* Bottom row: notifications + monthly sales */}
            <div className="h-[60%] grid grid-cols-2 gap-4">
                <CuentasPorCobrarSummary />
                <TopClientsChart />
            </div>
        </motion.main>
    )
}



