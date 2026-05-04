import { motion } from 'framer-motion'
import InventoryTable from '../components/inventario/InventarioMainList'


export default function InventarioPage() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full h-full overflow-y-auto p-6"
        >


            <InventoryTable />

        </motion.main>
    )
}
