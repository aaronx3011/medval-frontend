import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import NotificationsDropdown from './system/NotificationsDropdown'

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

            {/* Notifications */}
            <NotificationsDropdown />

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
