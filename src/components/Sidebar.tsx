import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HomeIcon, SalesIcon, InventoryIcon, LogoutIcon, ChevronIcon } from './Icons'
import logoMedval from '../public/resources/logoMedval.svg'
import { HandCoins, LucideHandCoins } from 'lucide-react'

// 1. Updated navItems with paths for React Router
const navItems = [
    { id: 'inicio', label: 'Inicio', Icon: HomeIcon, path: '/' },
    {
        id: 'ventas',
        label: 'Ventas',
        Icon: SalesIcon,
        path: '/ventas',
        subItems: [
            { id: 'productos', label: 'Productos', path: '/ventas/productos' },
            { id: 'inventario', label: 'Inventario', path: '/ventas/inventario' },
            { id: 'clientes', label: 'Clientes', path: '/ventas/clientes' },
            { id: 'tendencias', label: 'Tendencias', path: '/ventas/tendencias' },
        ]
    },
    {
        id: 'inventario',
        label: 'Inventario',
        Icon: InventoryIcon,
        path: '/inventario',
        subItems: [
            { id: 'stock', label: 'Stock Actual', path: '/inventario/stock' },
        ]
    },
    {
        id: 'cuentasporcobrar',
        label: 'Cuentas Por Cobrar',
        Icon: HandCoins,
        path: '/cuentas-por-cobrar',
    },
]

// 2. Restored your original Animation Variants
const containerVariants = {
    hidden: { x: -240 },
    visible: {
        x: 0,
        transition: { type: 'spring', stiffness: 260, damping: 26, staggerChildren: 0.05 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
}

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const location = useLocation();

    return (
        <motion.aside
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-[220px] min-h-screen bg-white border-r border-slate-100 flex flex-col"
        >
            {/* RESTORED: Logo Section */}
            <motion.div variants={itemVariants} className="flex h-20 items-center gap-3 px-5 pt-3 pb-1">
                <img src={logoMedval} className='w-full h-full' alt="Medval Logo" />
            </motion.div>

            <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
                {navItems.map(({ id, label, Icon, path, subItems }) => {
                    const isParentActive = (location.pathname.startsWith(path) && path !== '/')
                        || (path === '/' && location.pathname === '/');

                    return (
                        <motion.div
                            key={id}
                            variants={itemVariants}
                            onMouseEnter={() => setHoveredId(id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `nav-link flex items-center justify-between ${isActive || isParentActive ? 'active' : ''}`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </div>
                                {subItems && <ChevronIcon size={14} className={`transition-transform ${hoveredId === id ? 'rotate-90' : ''}`} />}
                            </NavLink>

                            <AnimatePresence>
                                {subItems && hoveredId === id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="ml-9 border-l border-slate-100 overflow-hidden"
                                    >
                                        {subItems.map((sub) => (
                                            <NavLink
                                                key={sub.id}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `block py-2 px-3 text-xs transition-colors ${isActive ? 'text-brand-navy font-bold' : 'text-slate-500 hover:text-brand-navy'}`
                                                }
                                            >
                                                {sub.label}
                                            </NavLink>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </nav>

            {/* RESTORED: Logout Button with Animations */}
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="m-3 mt-0 flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                   text-sm font-medium text-brand-navy border border-slate-100
                   hover:bg-surface-page transition-colors"
                onClick={onLogout}
            >
                <LogoutIcon size={17} />
                <span>Cerrar Sesión</span>
            </motion.div>
        </motion.aside>
    )
}
