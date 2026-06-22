import { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HomeIcon, SalesIcon, InventoryIcon, LogoutIcon, ChevronIcon } from './Icons'
import logoMedval from '../public/resources/logoMedval.svg'
import { HandCoins, X, Settings } from 'lucide-react'

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
            { id: 'por-producto', label: 'Productos', path: '/inventario/por-producto' },
            { id: 'por-vencimiento', label: 'Vencimientos', path: '/inventario/por-vencimiento' },
        ]
    },
    {
        id: 'cuentasporcobrar',
        label: 'Cuentas Por Cobrar',
        Icon: HandCoins,
        path: '/cuentas-por-cobrar',
    },
    {
        id: 'configuracion',
        label: 'Configuración',
        Icon: Settings,
        path: '/configuration',
        subItems: [
            { id: 'metas', label: 'Metas de Venta', path: '/configuration' },
            { id: 'users', label: 'Usuarios', path: '/configuration/users' },
            { id: 'patch-notes', label: 'Notas de Parche', path: '/configuration/patch-notes' },
            { id: 'issues', label: 'Reportar Problema', path: '/configuration/issues' },
        ]
    },
]

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
}

export default function Sidebar({ onLogout, isOpen, onClose }: { onLogout: () => void; isOpen: boolean; onClose: () => void }) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const location = useLocation();

    const autoExpandedId = useMemo(() => {
        for (const item of navItems) {
            if (!item.subItems) continue;
            const isOnSubPage = item.subItems.some(sub => location.pathname === sub.path);
            if (isOnSubPage) return item.id;
        }
        return null;
    }, [location.pathname]);

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const isExpanded = (id: string) => hoveredId === id || expandedId === id || autoExpandedId === id;

    const navContent = (
        <>
            <div className="flex h-20 items-center gap-3 px-5 pt-3 pb-1 relative">
                <img src={logoMedval} className='w-full h-full' alt="Medval Logo" />
                <button onClick={onClose} className="lg:hidden absolute top-2 right-2 p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X size={18} />
                </button>
            </div>

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
                            {subItems ? (
                                <div className={`nav-link flex items-center justify-between ${isParentActive ? 'active' : ''}`}>
                                    <NavLink
                                        to={path}
                                        onClick={onClose}
                                        className="flex items-center gap-3 flex-1"
                                    >
                                        <Icon size={18} />
                                        <span>{label}</span>
                                    </NavLink>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleExpand(id); }}
                                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronIcon size={14} className={`transition-transform ${isExpanded(id) ? 'rotate-90' : ''}`} />
                                    </button>
                                </div>
                            ) : (
                                <NavLink
                                    to={path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `nav-link flex items-center justify-between ${isActive || isParentActive ? 'active' : ''}`
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span>{label}</span>
                                    </div>
                                </NavLink>
                            )}

                            <AnimatePresence>
                                {subItems && isExpanded(id) && (
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
                                                end={sub.path === path}
                                                onClick={onClose}
                                                className={({ isActive }) =>
                                                    `block py-2 px-3 text-xs rounded-lg transition-colors ${isActive ? 'text-brand-navy font-bold bg-orange-50' : 'text-slate-500 hover:text-brand-navy hover:bg-orange-50 hover:font-semibold'}`
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
        </>
    );

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
            )}
            <aside className={`
                w-[220px] min-h-screen bg-white border-r border-slate-100 flex flex-col flex-shrink-0
                fixed inset-y-0 left-0 z-50
                lg:relative lg:translate-x-0 lg:z-auto
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {navContent}
            </aside>
        </>
    )
}
