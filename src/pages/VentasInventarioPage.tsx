import { motion } from 'framer-motion'
import VentaInventarioKpiRow from '../components/ventas/VentaInventarioKPIRow'
import VentasAnalisisRotacionSection from '../components/ventas/VentasAnalisisRotacionSection'

export default function VentasInventarioPage() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-6"
        >
            <VentaInventarioKpiRow />
            <VentasAnalisisRotacionSection />

        </motion.main>
    )
}
