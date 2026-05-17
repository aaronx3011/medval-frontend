import { motion } from 'framer-motion'
import { BellIcon } from './Icons'
import { Menu } from 'lucide-react'

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="h-20 bg-white border-b border-slate-100 px-4 lg:px-6 py-3 flex items-center gap-3"
        >
            {/* Hamburger */}
            <button
                onClick={onToggleSidebar}
                className="lg:hidden w-10 h-10 rounded-full bg-surface-page flex items-center justify-center text-brand-navy hover:bg-slate-200 transition-colors flex-shrink-0"
            >
                <Menu size={22} />
            </button>

            {/* Bell */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                className="relative w-11 h-11 rounded-full bg-surface-page flex items-center justify-center
                   text-brand-navy hover:bg-surface-page transition-colors flex-shrink-0"
            >
                <BellIcon size={24} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange border-2 border-white" />
            </motion.button>

            {/* User */}
            <div className="flex items-center gap-3 ml-auto">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-brand-navy leading-none mb-0.5">Yury Benitez</p>
                    <p className="text-xs text-slate-400">Perfil: Administrativo</p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center
                     text-white text-sm font-bold cursor-pointer select-none flex-shrink-0"
                >
                    YB
                </motion.div>
            </div>
        </motion.header>
    )
}
