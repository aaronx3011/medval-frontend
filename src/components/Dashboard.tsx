import { motion } from 'framer-motion'
import KpiRow from './KpiRow'
import DailyGoalsChart from './DailyGoalsChart'
import TopClientsChart from './TopClientsChart'
import NotificationsPanel from './NotificationsPanel'
import MonthlySalesChart from './MonthlySalesChart'

export default function Dashboard() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-6"
        >
            {/* KPI row */}
            <KpiRow />

            {/* Mid row: line chart + top clients */}
            <div className="w-full h-full grid grid-cols-2 gap-4 mb-4">
                <DailyGoalsChart />
                <TopClientsChart />
            </div>

            {/* Bottom row: notifications + monthly sales */}
            <div className="w-full h-full grid grid-cols-2 gap-4">
                <NotificationsPanel />
                <MonthlySalesChart />
            </div>
        </motion.main>
    )
}
