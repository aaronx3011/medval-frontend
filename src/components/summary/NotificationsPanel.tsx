import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'

// ── Types ─────────────────────────────────────────────────────────────────────
interface InventarioItem {
    Codigo_Articulo: string
    Descripcion_Articulo: string
    Estado_Stock: string
    Proximo_Vencimiento: string
    Stock_Total: number
    Venta_Promedio_Mensual_Actual: number
    Meses_De_Inventario_Restante: number
}

interface ApiResponse {
    data: InventarioItem[]
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ── Badge logic ───────────────────────────────────────────────────────────────
function monthsUntil(isoDate: string): number {
    const now = new Date()
    const target = new Date(isoDate)
    return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
}

function getAlerts(item: InventarioItem): { expiringSoon: boolean; lowStock: boolean } {
    const monthsToExpiry = monthsUntil(item.Proximo_Vencimiento)
    return {
        expiringSoon: monthsToExpiry <= 6,
        lowStock: item.Meses_De_Inventario_Restante < 8 && item.Meses_De_Inventario_Restante > 0,
    }
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

// ── Badges ────────────────────────────────────────────────────────────────────
function ExpiringSoonBadge({ monthsLeft }: { monthsLeft: number }) {
    const expired = monthsLeft <= 0
    const urgent = monthsLeft <= 2 && monthsLeft > 0
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide whitespace-nowrap
            ${expired
                ? 'bg-red-50 text-red-600 border border-red-200'
                : urgent
                    ? 'bg-red-50 text-red-500 border border-red-200'
                    : 'bg-orange-50 text-orange-500 border border-orange-200'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${expired ? 'bg-red-500' : urgent ? 'bg-red-400' : 'bg-orange-400'}`} />
            {expired ? 'VENCIDO' : `VENCE ${monthsLeft}m`}
        </span>
    )
}

function LowStockBadge({ months }: { months: number }) {
    const critical = months <= 2
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide whitespace-nowrap
            ${critical
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${critical ? 'bg-amber-500' : 'bg-yellow-400'}`} />
            {`STOCK ${months.toFixed(1)}m`}
        </span>
    )
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button onClick={() => onChange(!checked)} className="flex items-center gap-2 group">
            <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${checked ? 'bg-brand-orange' : 'bg-slate-200'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors select-none">
                {label}
            </span>
        </button>
    )
}

// ── Animations ────────────────────────────────────────────────────────────────
const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
}

const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.15 } },
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NotificationsPanel() {
    const [allItems, setAllItems] = useState<InventarioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showExpired, setShowExpired] = useState(false)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/view/aaron_view_AnalisisReposicionInventario?limit=100000`
                )
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const json: ApiResponse = await res.json()
                if (mounted) {
                    const filtered = json.data.filter(item => {
                        const { expiringSoon, lowStock } = getAlerts(item)
                        return expiringSoon || lowStock
                    })
                    const sorted = filtered.sort((a, b) => {
                        const aAlerts = getAlerts(a)
                        const bAlerts = getAlerts(b)
                        const aScore = (aAlerts.expiringSoon ? 1 : 0) + (aAlerts.lowStock ? 1 : 0)
                        const bScore = (bAlerts.expiringSoon ? 1 : 0) + (bAlerts.lowStock ? 1 : 0)
                        if (bScore !== aScore) return bScore - aScore
                        return monthsUntil(a.Proximo_Vencimiento) - monthsUntil(b.Proximo_Vencimiento)
                    })
                    setAllItems(sorted)
                }
            } catch (err) {
                if (mounted) setError(err instanceof Error ? err.message : 'Error desconocido')
            } finally {
                if (mounted) setIsLoading(false)
            }
        }
        fetchData()
        return () => { mounted = false }
    }, [])

    const visibleItems = showExpired
        ? allItems
        : allItems.filter(item => monthsUntil(item.Proximo_Vencimiento) > 0)

    const expiredCount = allItems.filter(item => monthsUntil(item.Proximo_Vencimiento) <= 0).length

    // ── Filters slot ──────────────────────────────────────────────────────────
    const filtersSlot = (
        <div className="flex items-center justify-between py-1.5">
            <Toggle
                checked={showExpired}
                onChange={setShowExpired}
                label="Mostrar vencidos"
            />
            {expiredCount > 0 && (
                <span className="text-[10px] text-red-400 font-semibold">
                    {expiredCount} vencido{expiredCount !== 1 ? 's' : ''}
                </span>
            )}
        </div>
    )

    // ── Table slot — plain overflow scroll, no absolute positioning ───────────
    const tableSlot = (
        <div className="overflow-y-auto overflow-x-auto w-full h-full min-w-0">
            {isLoading && (
                <div className="flex items-center justify-center py-10 text-xs text-slate-400">
                    Cargando...
                </div>
            )}
            {error && (
                <div className="flex items-center justify-center py-10 text-xs text-red-400">
                    Error: {error}
                </div>
            )}
            {!isLoading && !error && visibleItems.length === 0 && (
                <div className="flex items-center justify-center py-10 text-xs text-slate-400">
                    Sin alertas activas
                </div>
            )}
            {!isLoading && !error && visibleItems.length > 0 && (
                <motion.table
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full border-collapse"
                >
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {visibleItems.map((item, i) => {
                                const { expiringSoon, lowStock } = getAlerts(item)
                                const monthsLeft = monthsUntil(item.Proximo_Vencimiento)
                                return (
                                    <motion.tr
                                        key={item.Codigo_Articulo}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="py-2 pr-3 text-xs text-slate-400 font-medium w-16 align-middle whitespace-nowrap">
                                            {formatDate(item.Proximo_Vencimiento)}
                                        </td>
                                        <td className="py-2 pr-3 text-xs text-brand-navy align-middle min-w-0">
                                            <span className="text-slate-400 mr-1">{item.Codigo_Articulo}</span>
                                            <span className="break-words">{item.Descripcion_Articulo}</span>
                                        </td>
                                        <td className="py-2 align-middle">
                                            <div className="flex items-center justify-end gap-1 flex-wrap">
                                                {expiringSoon && <ExpiringSoonBadge monthsLeft={monthsLeft} />}
                                                {lowStock && <LowStockBadge months={item.Meses_De_Inventario_Restante} />}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </AnimatePresence>
                    </tbody>
                </motion.table>
            )}
        </div>
    )

    return (
        <GraphCardWithFilters
            title="Notificaciones"
            filters={filtersSlot}
            graph={tableSlot}
            legend={<></>}
        />
    )
}
