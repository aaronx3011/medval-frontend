import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, Paper, CircularProgress, alpha } from '@mui/material'
import { X, ArrowLeft } from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import { table as tableColors } from '../../config/colors'

interface AnalisisItem {
    Codigo_Articulo: string
    Ref_Articulo: string
    Descripcion_Articulo: string
    Stock_Total: number
    Proximo_Vencimiento: string
    Estado_Stock: string
    Venta_Promedio_Mensual_Actual: number
    Meses_De_Inventario_Restante: number
    Meta_Venta_Mensual_Para_No_Perder: number
    Ultimo_Precio_Venta_USD: number | null
    Ultimo_Costo_Compra_USD: number | null
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

function monthsUntil(isoDate: string | null): number {
    if (!isoDate) return Infinity
    const now = new Date()
    const target = new Date(isoDate)
    return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
}

function formatDate(iso: string | null): string {
    if (!iso) return '—'
    const datePart = iso.includes('T') ? iso.split('T')[0] : iso
    const [year, month, day] = datePart.split('-')
    if (!year || !month || !day || year.length !== 4) return '—'
    const y = +year
    if (y < 1900 || y > 2100) return '—'
    return `${day}/${month}/${year}`
}

function getAlerts(item: AnalisisItem) {
    const monthsToExpiry = monthsUntil(item.Proximo_Vencimiento)
    return {
        expiringSoon: monthsToExpiry <= 6,
        lowStock: (item.Meses_De_Inventario_Restante === null || item.Meses_De_Inventario_Restante < 8) && item.Stock_Total > 0,
        sinStock: item.Stock_Total <= 0,
    }
}

function ExpiringSoonBadge({ monthsLeft }: { monthsLeft: number }) {
    const expired = monthsLeft <= 0
    const urgent = monthsLeft <= 2 && monthsLeft > 0
    return (
        <span className={`inline-flex items-center gap-1 rounded text-[11px] font-bold tracking-wide whitespace-nowrap
            ${expired ? 'text-red-600' : urgent ? 'text-red-500' : 'text-amber-500'}`}
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
            ${critical ? 'text-amber-600' : 'text-yellow-600'}`}
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
            return expiringSoon ? <ExpiringSoonBadge monthsLeft={monthsLeft} /> : null
        },
    },
]

const VIEW_ENDPOINTS: Record<string, string> = {
    critico: '/view/aaron_view_AnalisisReposicionCritico?limit=10000',
    'stock-bajo': '/view/aaron_view_AnalisisReposicionStockBajo?limit=10000',
    activo: '/view/aaron_view_AnalisisReposicionActivo?limit=10000',
}

interface StockDetailModalProps {
    open: boolean
    onClose: () => void
    filterType: 'critico' | 'stock-bajo' | 'activo'
    title: string
}

export default function StockDetailModal({ open, onClose, filterType, title }: StockDetailModalProps) {
    const [items, setItems] = useState<AnalisisItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<AnalisisItem | null>(null)
    const [lotRows, setLotRows] = useState<GroupedLot[]>([])
    const [lotsLoading, setLotsLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        let mounted = true
        setIsLoading(true)
        setError(null)
        setSelectedItem(null)
        setLotRows([])
        const fetchData = async () => {
            try {
                const json: { data: AnalisisItem[] } = await apiClient(VIEW_ENDPOINTS[filterType])
                if (mounted) setItems(json.data)
            } catch (err) {
                if (mounted) setError(err instanceof Error ? err.message : 'Error desconocido')
            } finally {
                if (mounted) setIsLoading(false)
            }
        }
        fetchData()
        return () => { mounted = false }
    }, [open, filterType])

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

    const handleBack = () => {
        setSelectedItem(null)
        setLotRows([])
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/30" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-2xl p-6 w-full mx-auto shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                        style={{ maxWidth: selectedItem ? '28rem' : '64rem' }}
                    >
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <div className="flex items-center gap-3">
                                {selectedItem && (
                                    <button onClick={handleBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                        <ArrowLeft size={20} />
                                    </button>
                                )}
                                <h2 className="text-lg font-bold text-brand-navy">
                                    {selectedItem ? selectedItem.Descripcion_Articulo : title}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-page text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {selectedItem ? (
                            <div className="overflow-y-auto space-y-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-semibold">{selectedItem.Ref_Articulo}</span>
                                    <span>·</span>
                                    <span>Stock: {selectedItem.Stock_Total.toLocaleString()}</span>
                                    <span>·</span>
                                    <span>Vence: {formatDate(selectedItem.Proximo_Vencimiento)}</span>
                                </div>

                                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
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

                                <button
                                    onClick={handleBack}
                                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-amber-500 transition-colors"
                                >
                                    Volver a la lista
                                </button>
                            </div>
                        ) : (
                            <Box sx={{ height: 420, width: '100%', flex: 1 }}>
                                {filterType === 'activo' && (
                                    <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                                        Solo se muestran productos con estado <strong>VIGENTE</strong> y <strong>CRÍTICO</strong>. Los productos vencidos están excluidos de esta vista.
                                    </div>
                                )}
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
                                            rows={items}
                                            columns={columns}
                                            getRowId={(row) => row.Codigo_Articulo}
                                            onRowClick={(params) => setSelectedItem(params.row as AnalisisItem)}
                                            disableColumnMenu
                                            disableRowSelectionOnClick
                                            density="compact"
                                            rowHeight={44}
                                            columnHeaderHeight={40}
                                            initialState={{
                                                pagination: { paginationModel: { page: 0, pageSize: 10 } },
                                                sorting: { sortModel: [{ field: 'Proximo_Vencimiento', sort: 'asc' }] },
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
                                        />
                                    )}
                                </Paper>
                            </Box>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
