import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid'
import { Box, Paper, CircularProgress, alpha, InputBase } from '@mui/material'
import { Search, X } from 'lucide-react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { apiClient } from '../../services/apiClient'
import DownloadCsvButton, { sanitizeFilename } from '../utils/DownloadCsvButton'
import { search as searchColors, table as tableColors, component as componentColors, status as statusColors, slate } from '../../config/colors'

// ── Types ─────────────────────────────────────────────────────────────────────
interface InventarioItem {
    Codigo_Articulo: string
    Ref_Articulo: string
    Descripcion_Articulo: string
    Estado_Stock: string
    Proximo_Vencimiento: string
    Stock_Total: number
    Venta_Promedio_Mensual_Actual: number
    Meses_De_Inventario_Restante: number
    Meta_Venta_Mensual_Para_No_Perder: number
    Ultimo_Precio_Venta_USD: number | null
    Ultimo_Costo_Compra_USD: number | null
}

interface ApiResponse {
    data: InventarioItem[]
}

interface LotInventoryItem {
    Codigo_Articulo: string
    Codigo_Almacen: string
    Nombre_Almacen: string
    Unidades: number
    Fecha_Vencimiento: string | null
    Lote: string
}

interface GroupedLot {
    Lote: string
    Unidades: number
    Fecha_Vencimiento: string | null
    Almacenes: string[]
}

// ── Badge logic ───────────────────────────────────────────────────────────────
function monthsUntil(isoDate: string | null): number {
    if (!isoDate) return Infinity;
    const now = new Date()
    const target = new Date(isoDate)
    return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
}

function getAlerts(item: InventarioItem): { expiringSoon: boolean; lowStock: boolean; sinStock: boolean } {
    const monthsToExpiry = monthsUntil(item.Proximo_Vencimiento)
    return {
        expiringSoon: monthsToExpiry <= 6,
        lowStock: (item.Meses_De_Inventario_Restante === null || item.Meses_De_Inventario_Restante < 8) && item.Stock_Total > 0,
        sinStock: item.Stock_Total <= 0,
    }
}

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const datePart = iso.includes('T') ? iso.split('T')[0] : iso;
    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day || year.length !== 4) return '—';
    const y = +year;
    if (y < 1900 || y > 2100) return '—';
    return `${day}/${month}/${year}`;
}

// ── Badges ────────────────────────────────────────────────────────────────────
function ExpiringSoonBadge({ monthsLeft }: { monthsLeft: number }) {
    const expired = monthsLeft <= 0
    const urgent = monthsLeft <= 2 && monthsLeft > 0
    return (
        <span className={`inline-flex items-center gap-1 rounded text-[11px] font-bold tracking-wide whitespace-nowrap
            ${expired
                ? 'text-red-600'
                : urgent
                    ? 'text-red-500'
                    : 'text-amber-500'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${expired ? 'bg-red-500' : urgent ? 'bg-red-400' : 'bg-amber-400'}`} />
            {expired ? 'VENCIDO' : `VENCE ${monthsLeft} meses`}
        </span>
    )
}

function LowStockBadge({ months }: { months: number | null }) {
    const critical = months !== null && months <= 2
    return (
        <span className={`inline-flex items-center gap-1 rounded text-[11px] font-bold tracking-wide whitespace-nowrap
            ${critical
                ? 'text-amber-600'
                : 'text-yellow-600'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${critical ? 'bg-amber-500' : 'bg-yellow-400'}`} />
            {months !== null ? `STOCK ${months.toFixed(1)} meses` : 'STOCK N/A'}
        </span>
    )
}

function SinStockBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded text-[11px] font-bold tracking-wide whitespace-nowrap text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            SIN STOCK
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

// ── Columns ───────────────────────────────────────────────────────────────────
const columns: GridColDef[] = [
    {
        field: 'Proximo_Vencimiento',
        headerName: 'Fecha',
        width: 100,
        renderCell: (params: any) => (
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {formatDate(params.value)}
            </span>
        ),
    },
    {
        field: 'Ref_Articulo',
        headerName: 'Ref',
        width: 100,
    },
    {
        field: 'Descripcion_Articulo',
        headerName: 'Nombre',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'Meses_De_Inventario_Restante',
        headerName: 'Stock',
        width: 130,
        renderCell: (params: any) => {
            const { lowStock, sinStock } = getAlerts(params.row)
            if (sinStock) return <SinStockBadge />
            if (lowStock) return <LowStockBadge months={params.value} />
            return null
        },
    },
    {
        field: 'vencimiento_badge',
        headerName: 'Vencimiento',
        width: 130,
        valueGetter: (_value: any, row: any) => row.Proximo_Vencimiento || '9999-12-31',
        renderCell: (params: any) => {
            const { expiringSoon } = getAlerts(params.row)
            const monthsLeft = monthsUntil(params.row.Proximo_Vencimiento)
            return expiringSoon ? (
                <ExpiringSoonBadge monthsLeft={monthsLeft} />
            ) : null
        },
    },
]

// ── Modal Field ────────────────────────────────────────────────────────────────
function Field({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
            <span className="text-xs text-slate-500 font-medium">{label}</span>
            <span
                className="text-sm font-semibold text-right"
                style={{
                    color: color || (highlight ? (value.includes('CRITICO') || value.includes('VENCIDO') ? statusColors.error : slate[800]) : slate[800])
                }}
            >
                {value}
            </span>
        </div>
    )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NotificationsPanel() {
    const [allItems, setAllItems] = useState<InventarioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showExpired, setShowExpired] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null)
    const [lotRows, setLotRows] = useState<GroupedLot[]>([])
    const [lotsLoading, setLotsLoading] = useState(false)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            try {
                const json: ApiResponse = await apiClient('/view/aaron_view_AnalisisReposicionInventario?limit=100000')
                if (mounted) {
                    const filtered = json.data.filter(item => {
                        const { expiringSoon, lowStock } = getAlerts(item)
                        return (expiringSoon || lowStock) && item.Stock_Total > 0
                    })
                    const sorted = filtered.sort((a, b) => {
                        const aAlerts = getAlerts(a)
                        const bAlerts = getAlerts(b)
                        const aScore = (aAlerts.expiringSoon ? 1 : 0) + (aAlerts.lowStock ? 1 : 0) + (aAlerts.sinStock ? 1 : 0)
                        const bScore = (bAlerts.expiringSoon ? 1 : 0) + (bAlerts.lowStock ? 1 : 0) + (bAlerts.sinStock ? 1 : 0)
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

    useEffect(() => {
        if (!selectedItem) return
        let mounted = true
        setLotRows([])
        setLotsLoading(true)
        const fetchLots = async () => {
            try {
                const json: { data: LotInventoryItem[] } = await apiClient(`/inventario/lotes/${encodeURIComponent(selectedItem.Codigo_Articulo)}`)
                if (!mounted) return
                const grouped: Record<string, GroupedLot> = {}
                for (const item of json.data) {
                    if (!grouped[item.Lote]) {
                        grouped[item.Lote] = { Lote: item.Lote, Unidades: 0, Fecha_Vencimiento: item.Fecha_Vencimiento, Almacenes: [] }
                    }
                    grouped[item.Lote].Unidades += item.Unidades
                    if (item.Fecha_Vencimiento && (!grouped[item.Lote].Fecha_Vencimiento || item.Fecha_Vencimiento < grouped[item.Lote].Fecha_Vencimiento!)) {
                        grouped[item.Lote].Fecha_Vencimiento = item.Fecha_Vencimiento
                    }
                    if (!grouped[item.Lote].Almacenes.includes(item.Nombre_Almacen)) {
                        grouped[item.Lote].Almacenes.push(item.Nombre_Almacen)
                    }
                }
                setLotRows(Object.values(grouped).sort((a, b) => {
                    const aDate = a.Fecha_Vencimiento ?? '9999-12-31'
                    const bDate = b.Fecha_Vencimiento ?? '9999-12-31'
                    return aDate.localeCompare(bDate)
                }))
            } catch {
                if (mounted) setLotRows([])
            } finally {
                if (mounted) setLotsLoading(false)
            }
        }
        fetchLots()
        return () => { mounted = false }
    }, [selectedItem])

    const filteredRows = useMemo(() => {
        let items = showExpired
            ? allItems
            : allItems.filter(item => monthsUntil(item.Proximo_Vencimiento) > 0)

        if (searchText) {
            const q = searchText.toLowerCase()
            items = items.filter(row =>
                Object.values(row).some(val =>
                    val?.toString().toLowerCase().includes(q)
                )
            )
        }
        return items
    }, [allItems, showExpired, searchText])

    const expiredCount = allItems.filter(item => monthsUntil(item.Proximo_Vencimiento) <= 0).length

    const apiRef = useGridApiRef();

    const csvFilename = [
        'notificaciones',
        showExpired ? 'mostrando-vencidos' : 'sin-vencidos',
        searchText
    ].filter(Boolean).map(s => sanitizeFilename(s)).join('_') || 'notificaciones';

    // ── Filters slot ──────────────────────────────────────────────────────────
    const filtersSlot = (
        <div className="mb-3">
        <div className="flex items-center justify-between gap-2 py-1.5">
            <Paper
                elevation={0}
                sx={{
                    p: '4px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: '100%', sm: '220px' },
                    backgroundColor: searchColors.bg,
                    borderRadius: '10px',
                    border: `1px solid ${searchColors.border}`,
                    '&:focus-within': { borderColor: searchColors.focusBorder }
                }}
            >
                <Search size={16} color={searchColors.iconColor} style={{ marginRight: '8px' }} />
                <InputBase
                    placeholder="Buscar producto..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ fontSize: '0.8rem', flex: 1 }}
                />
                {searchText && (
                    <X
                        size={16}
                        color={searchColors.clearColor}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSearchText('')}
                    />
                )}
            </Paper>
            <div className="flex items-center gap-2">
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
        </div>
        </div>
    )

    // ── Table slot ────────────────────────────────────────────────────────────
    const tableSlot = (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Paper elevation={0} sx={{ height: '100%', width: '100%', border: `1px solid ${tableColors.paperBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'error.main', fontSize: '0.8rem' }}>
                        Error: {error}
                    </Box>
                ) : (
                    <DataGrid
                        apiRef={apiRef}
                        rows={filteredRows}
                        columns={columns}
                        getRowId={(row) => row.Codigo_Articulo}
                        onRowClick={(params) => setSelectedItem(params.row as InventarioItem)}
                        disableColumnMenu
                        disableRowSelectionOnClick
                        density="compact"
                        rowHeight={44}
                        columnHeaderHeight={40}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                            sorting: {
                                sortModel: [{ field: 'Proximo_Vencimiento', sort: 'asc' }],
                            },
                        }}
                        pagination
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: tableColors.headerBg,
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                color: tableColors.headerText,
                                textTransform: 'uppercase',
                                borderBottom: `1px solid ${tableColors.paperBorder}`,
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '0.75rem',
                                color: tableColors.cellText,
                                borderBottom: `1px solid ${tableColors.cellBorder}`,
                                display: 'flex',
                                alignItems: 'center'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                minHeight: '40px',
                                height: '40px',
                                borderTop: `1px solid ${tableColors.footerBorder}`,
                            },
                            '& .MuiTablePagination-root': {
                                fontSize: '0.7rem',
                                overflow: 'visible',
                            },
                            '& ::-webkit-scrollbar': { width: '6px', height: '6px' },
                            '& ::-webkit-scrollbar-thumb': {
                                backgroundColor: alpha(tableColors.scrollbarThumb.split("'")[1] || '#000', 0.1),
                                borderRadius: '10px'
                            },
                        }}
                            slotProps={{
                                noRowsOverlay: {
                                    sx: {
                                        fontSize: '0.8rem',
                                        color: componentColors.placeholder,
                                    }
                                }
                            }}
                    />
                )}
            </Paper>
        </Box>
    )

    return (
        <>
            <GraphCardWithFilters
                title="Notificaciones"
                actions={<DownloadCsvButton apiRef={apiRef} filename={csvFilename} />}
                filters={filtersSlot}
                graph={tableSlot}
                legend={<></>}
            />

            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/30" onClick={() => setSelectedItem(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-brand-navy">Detalle del Producto</h2>
                                <button onClick={() => setSelectedItem(null)} className="p-1.5 rounded-lg hover:bg-surface-page text-slate-400 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <Field label="Ref" value={selectedItem.Ref_Articulo} />
                                <Field label="Producto" value={selectedItem.Descripcion_Articulo} />
                                <Field label="Stock Total" value={selectedItem.Stock_Total.toLocaleString()} />
                                <Field
                                    label="Valor Total Venta"
                                    value={`$${((selectedItem.Ultimo_Precio_Venta_USD ?? 0) * selectedItem.Stock_Total).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                />
                                <Field
                                    label="Valor Total Costo"
                                    value={`$${((selectedItem.Ultimo_Costo_Compra_USD ?? 0) * selectedItem.Stock_Total).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                />
                                <Field label="Estado de Stock" value={selectedItem.Estado_Stock} highlight />
                                <Field label="Próximo Vencimiento" value={formatDate(selectedItem.Proximo_Vencimiento)} />
                                <Field
                                    label="Meses de Inventario Restante"
                                    value={selectedItem.Meses_De_Inventario_Restante !== null ? `${selectedItem.Meses_De_Inventario_Restante.toFixed(1)} meses` : 'N/A'}
                                />
                                <Field
                                    label="Venta Promedio Mensual"
                                    value={`$${selectedItem.Venta_Promedio_Mensual_Actual.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                />
                                <Field
                                    label="Meta Mensual para No Perder"
                                    value={(() => {
                                        const meses = selectedItem.Meses_De_Inventario_Restante;
                                        const precio = selectedItem.Ultimo_Precio_Venta_USD;
                                        if (meses === null || meses === 0 || precio === null) return '—';
                                        const total = (selectedItem.Stock_Total * precio) / meses;
                                        return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                                    })()}
                                />
                                <Field
                                    label="Meta Mensual en Unidades"
                                    value={(() => {
                                        const meses = selectedItem.Meses_De_Inventario_Restante;
                                        if (meses === null || meses === 0) return '—';
                                        return `${Math.ceil(selectedItem.Stock_Total / meses)}`;
                                    })()}
                                />
                                <Field
                                    label="Último Precio de Venta"
                                    value={selectedItem.Ultimo_Precio_Venta_USD !== null ? `$${selectedItem.Ultimo_Precio_Venta_USD.toFixed(2)}` : '—'}
                                />
                                <Field
                                    label="Último Costo de Compra"
                                    value={selectedItem.Ultimo_Costo_Compra_USD !== null ? `$${selectedItem.Ultimo_Costo_Compra_USD.toFixed(2)}` : '—'}
                                />
                                {(() => {
                                    const precio = selectedItem.Ultimo_Precio_Venta_USD ?? 0;
                                    const costo = selectedItem.Ultimo_Costo_Compra_USD ?? 0;
                                    const margen = precio !== 0 ? ((precio - costo) / precio) * 100 : 0;
                                    return (
                                        <Field
                                            label="Margen"
                                            value={`${margen.toFixed(1)}%`}
                                            highlight
                                            color={margen >= 0 ? statusColors.success : statusColors.error}
                                        />
                                    );
                                })()}
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3">
                                    Lotes ({lotRows.length})
                                </h3>
                                {lotsLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <CircularProgress size={20} />
                                    </div>
                                ) : lotRows.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-4">Sin información de lotes</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="text-left py-2 pr-3 font-semibold text-slate-500">Lote</th>
                                                    <th className="text-right py-2 px-3 font-semibold text-slate-500">Unid.</th>
                                                    <th className="text-left py-2 px-3 font-semibold text-slate-500">Venc.</th>
                                                    <th className="text-left py-2 pl-3 font-semibold text-slate-500">Almacén</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lotRows.map((lot) => (
                                                    <tr key={lot.Lote} className="border-b border-slate-50">
                                                        <td className="py-2 pr-3 font-mono text-slate-700 font-medium">{lot.Lote}</td>
                                                        <td className="text-right py-2 px-3 font-semibold text-slate-900">{lot.Unidades.toLocaleString()}</td>
                                                        <td className="py-2 px-3 text-slate-500">{formatDate(lot.Fecha_Vencimiento)}</td>
                                                        <td className="py-2 pl-3 text-slate-500">{lot.Almacenes.join(', ')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full mt-6 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-amber-500 transition-colors"
                            >
                                Cerrar
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
