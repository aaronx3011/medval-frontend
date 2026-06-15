import { motion } from 'framer-motion'
import DistribucionVentaAnualPorProducto from '../components/ventas/DistribucionVentaAnualPorProducto'
import LineAllTearsByMonth from '../components/ventas/LineAllYearsByMonth'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useFechasDisponibles } from '../hooks/useFechasDisponibles'
import { apiClient } from '../services/apiClient'

// ── Types ─────────────────────────────────────────────────────────────────────
interface VentaDetalle {
    Fecha_Emision: string
    Monto_Renglon_USD: number
    [key: string]: unknown
}

interface ApiResponse {
    data: VentaDetalle[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']


function getDayKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function cacheKey(year: number, month: number): string {
    return `${year}-${month}`
}

function offsetMonth(year: number, month: number, delta: number): { year: number; month: number } {
    let m = month + delta
    let y = year
    while (m > 11) { m -= 12; y++ }
    while (m < 0) { m += 12; y-- }
    return { year: y, month: m }
}

function aggregateToDailyMap(data: VentaDetalle[]): Record<string, number> {
    const map: Record<string, number> = {}
    for (const row of data) {
        const dateKey = row.Fecha_Emision.split('T')[0]
        map[dateKey] = (map[dateKey] ?? 0) + (row.Monto_Renglon_USD ?? 0)
    }
    for (const k in map) map[k] = Math.round(map[k] * 100) / 100
    return map
}

// ── Color scale ───────────────────────────────────────────────────────────────
const THRESHOLDS = [1, 500, 2000, 5000, 10000, 20000]
const COLORS = ['#f1f5f9', '#cce0ff', '#99baf0', '#5b7fcc', '#2d3f7a', '#1a2a5e']

function getColor(value: number | undefined): string {
    if (!value) return '#f8fafc'
    for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
        if (value >= THRESHOLDS[i]) return COLORS[Math.min(i, COLORS.length - 1)]
    }
    return COLORS[0]
}

function getTextColor(bg: string): string {
    const dark = ['#2d3f7a', '#1a2a5e', '#5b7fcc']
    return dark.includes(bg) ? '#fff' : '#1e293b'
}

// ── Calendar component ────────────────────────────────────────────────────────
function MonthCalendar() {
    const today = new Date()

    const { data: fechasDisponibles, isLoading: loadingFechas } = useFechasDisponibles()

    const availableMonths = useMemo(() => {
        const set = new Set<string>()
        for (const f of fechasDisponibles) {
            if (f.year !== undefined && f.month !== undefined) {
                set.add(`${f.year}-${f.month}`)
            }
        }
        return set
    }, [fechasDisponibles])

    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())
    const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; value: number } | null>(null)

    // cache: cacheKey(year, month) → Record<dateString, usd>
    const cache = useRef<Map<string, Record<string, number>>>(new Map())
    // track in-flight fetches so we never double-fetch
    const fetching = useRef<Set<string>>(new Set())

    // ── Fetch a single month, populate cache ─────────────────────────────────
    const fetchMonth = useCallback(async (year: number, month: number) => {
        const key = cacheKey(year, month)
        if (cache.current.has(key) || fetching.current.has(key)) return
        fetching.current.add(key)
        try {
            const apiMonth = month + 1
            const json: ApiResponse = await apiClient(`/ventas/detalle-ventas-por-mes-por-anio?year=${year}&month=${apiMonth}`)
            cache.current.set(key, aggregateToDailyMap(json.data ?? []))
        } catch (err) {
            console.error(`Error fetching ${key}:`, err)
            // store empty so we don't retry on every render
            cache.current.set(key, {})
        } finally {
            fetching.current.delete(key)
        }
    }, [])

    // ── Fetch current month + 2 before + 2 after ──────────────────────────────
    // We use a separate loading state only for the *viewed* month
    const [isLoading, setIsLoading] = useState(false)
    // bump this to force a re-render once background fetches land
    const [cacheVersion, setCacheVersion] = useState(0)

    const fetchWindow = useCallback(async (year: number, month: number) => {
        const neighbors = [-2, -1, 0, 1, 2].map(d => offsetMonth(year, month, d))

        // Kick off background fetches for neighbours (non-blocking)
        for (const { year: y, month: m } of neighbors) {
            const key = cacheKey(y, m)
            if (!cache.current.has(key) && !fetching.current.has(key)) {
                fetchMonth(y, m).then(() => setCacheVersion(v => v + 1))
            }
        }

        // Wait for the viewed month specifically
        const viewedKey = cacheKey(year, month)
        if (!cache.current.has(viewedKey)) {
            setIsLoading(true)
            await fetchMonth(year, month)
            setCacheVersion(v => v + 1)
            setIsLoading(false)
        }
    }, [fetchMonth])

    // Trigger on mount and whenever view changes
    useEffect(() => {
        fetchWindow(viewYear, viewMonth)
    }, [viewYear, viewMonth, fetchWindow])

    // ── Current daily data from cache ─────────────────────────────────────────
    // cacheVersion in deps ensures we re-read after background fetch completes
    const dailyData = useMemo(
        () => cache.current.get(cacheKey(viewYear, viewMonth)) ?? {},
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [viewYear, viewMonth, cacheVersion]
    )

    // ── Navigation ────────────────────────────────────────────────────────────
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

    const goBack = () => {
        const { year: y, month: m } = offsetMonth(viewYear, viewMonth, -1)
        setViewYear(y)
        setViewMonth(m)
    }

    const goForward = () => {
        if (isCurrentMonth) return
        const { year: y, month: m } = offsetMonth(viewYear, viewMonth, 1)
        setViewYear(y)
        setViewMonth(m)
    }

    // ── Build calendar grid ───────────────────────────────────────────────────
    const { weeks, monthTotal } = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1)
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

        let startOffset = firstDay.getDay() - 1
        if (startOffset < 0) startOffset = 6

        const weeks: (number | null)[][] = []
        let week: (number | null)[] = Array(startOffset).fill(null)

        for (let d = 1; d <= daysInMonth; d++) {
            week.push(d)
            if (week.length === 7) { weeks.push(week); week = [] }
        }
        if (week.length > 0) {
            while (week.length < 7) week.push(null)
            weeks.push(week)
        }

        let total = 0
        for (let d = 1; d <= daysInMonth; d++) {
            total += dailyData[getDayKey(viewYear, viewMonth, d)] ?? 0
        }

        return { weeks, monthTotal: Math.round(total * 100) / 100 }
    }, [viewYear, viewMonth, dailyData])

    return (
        <div className="relative w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={goBack}
                    disabled={loadingFechas || isLoading}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="text-center">
                    <p className="text-base font-bold text-slate-800 flex items-center gap-2 justify-center">
                        {MONTH_NAMES[viewMonth]} {viewYear}
                        {isLoading && <Loader2 size={14} className="animate-spin text-slate-400" />}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Total:{' '}
                        <span className="font-semibold text-slate-600">
                            ${monthTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </p>
                </div>

                <button
                    onClick={goForward}
                    disabled={isCurrentMonth || isLoading}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map(d => (
                    <div key={d} className="text-center py-0.5 sm:py-1 text-[8px] sm:text-[10px]" style={{ fontWeight: 600, color: '#94a3b8' }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Weeks */}
            <div
                className="flex flex-col gap-1"
                style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}
            >
                {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1">
                        {week.map((day, di) => {
                            if (day === null) return <div key={di} />

                            const key = getDayKey(viewYear, viewMonth, day)
                            const value = dailyData[key]
                            const color = getColor(value)
                            const textColor = getTextColor(color)
                            const isToday =
                                day === today.getDate() &&
                                viewMonth === today.getMonth() &&
                                viewYear === today.getFullYear()

                            return (
                                <div
                                    key={di}
                                    className="rounded-lg flex flex-col items-center justify-center transition-all duration-150 cursor-pointer h-10 sm:h-14"
                                    style={{
                                        backgroundColor: color,
                                        border: isToday ? '2px solid #FF6600' : '2px solid transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (value !== undefined)
                                            setTooltip({ x: e.clientX, y: e.clientY, date: key, value })
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <span className="text-[8px] sm:text-[11px]" style={{ fontWeight: 600, color: textColor, opacity: 0.6, lineHeight: 1 }}>
                                        {day}
                                    </span>
                                    {value !== undefined && (
                                        <span className="text-[6px] sm:text-[9px]" style={{ fontWeight: 700, color: textColor, marginTop: 2, lineHeight: 1 }}>
                                            ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)}
                                        </span>
                                    )}
                                    {value === undefined && (
                                        <span className="text-[6px] sm:text-[8px]" style={{ color: '#cbd5e1', marginTop: 1 }}>—</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-5">
                <span className="text-[10px] text-slate-500 font-medium">Menor</span>
                <div className="flex gap-1.5">
                    {COLORS.map((color, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                            <span className="w-5 h-3 rounded-sm block" style={{ background: color }} />
                            <span style={{ fontSize: 7, color: '#9ca3af' }}>
                                {i === 0 ? '$0' : `$${THRESHOLDS[i] >= 1000 ? `${THRESHOLDS[i] / 1000}k` : THRESHOLDS[i]}`}
                            </span>
                        </div>
                    ))}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Mayor</span>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div className="fixed z-50 pointer-events-none" style={{ left: tooltip.x + 14, top: tooltip.y - 56 }}>
                    <div style={{
                        background: '#1e293b', borderRadius: 8, padding: '8px 12px',
                        color: '#fff', fontSize: '0.72rem', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
                    }}>
                        <div style={{ color: '#94a3b8', marginBottom: 3 }}>{tooltip.date}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            ${tooltip.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HeatmapSummaryView() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full h-full overflow-y-auto p-4 lg:p-6 gap-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="chart-card"
            >
                <h3 className="text-l font-bold text-brand-orange uppercase mb-4">Ventas Diarias</h3>
                <div className="px-2">
                    <MonthCalendar />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 min-w-0">
                <div className="min-h-[300px] lg:min-h-[380px]">
                    <DistribucionVentaAnualPorProducto />
                </div>
                <div className="min-h-[300px] lg:min-h-[380px]">
                    <LineAllTearsByMonth />
                </div>
            </div>
        </motion.main>
    )
}
