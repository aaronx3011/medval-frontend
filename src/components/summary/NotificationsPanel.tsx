import { useEffect, useState, useMemo } from 'react'
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid'
import { Box, Paper, CircularProgress, alpha, InputBase } from '@mui/material'
import { Search, X } from 'lucide-react'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { apiClient } from '../../services/apiClient'
import DownloadCsvButton, { sanitizeFilename } from '../utils/DownloadCsvButton'

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
                    : 'text-orange-500'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${expired ? 'bg-red-500' : urgent ? 'bg-red-400' : 'bg-orange-400'}`} />
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
        field: 'Codigo_Articulo',
        headerName: 'Código',
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function NotificationsPanel() {
    const [allItems, setAllItems] = useState<InventarioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showExpired, setShowExpired] = useState(false)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            try {
                const json: ApiResponse = await apiClient('/view/aaron_view_AnalisisReposicionInventario?limit=100000')
                if (mounted) {
                    const filtered = json.data.filter(item => {
                        const { expiringSoon, lowStock, sinStock } = getAlerts(item)
                        return expiringSoon || lowStock || sinStock
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
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E0E4E8',
                    '&:focus-within': { borderColor: '#FF6600' }
                }}
            >
                <Search size={16} color="#A0AEC0" style={{ marginRight: '8px' }} />
                <InputBase
                    placeholder="Buscar producto..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ fontSize: '0.8rem', flex: 1 }}
                />
                {searchText && (
                    <X
                        size={16}
                        color="#A0AEC0"
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
            <Paper elevation={0} sx={{ height: '100%', width: '100%', border: '1px solid #E0E4E8', borderRadius: '12px', overflow: 'hidden' }}>
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
                                backgroundColor: '#f8fafc',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                color: '#1e293b',
                                textTransform: 'uppercase',
                                borderBottom: '1px solid #E0E4E8',
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '0.75rem',
                                color: '#475569',
                                borderBottom: '1px solid #F1F5F9',
                                display: 'flex',
                                alignItems: 'center'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                minHeight: '40px',
                                height: '40px',
                                borderTop: '1px solid #F1F5F9',
                            },
                            '& .MuiTablePagination-root': {
                                fontSize: '0.7rem',
                                overflow: 'visible',
                            },
                            '& ::-webkit-scrollbar': { width: '6px', height: '6px' },
                            '& ::-webkit-scrollbar-thumb': {
                                backgroundColor: alpha('#000', 0.1),
                                borderRadius: '10px'
                            },
                        }}
                        slotProps={{
                            noRowsOverlay: {
                                sx: {
                                    fontSize: '0.8rem',
                                    color: '#94a3b8',
                                }
                            }
                        }}
                    />
                )}
            </Paper>
        </Box>
    )

    return (
        <GraphCardWithFilters
            title="Notificaciones"
            actions={<DownloadCsvButton apiRef={apiRef} filename={csvFilename} />}
            filters={filtersSlot}
            graph={tableSlot}
            legend={<></>}
        />
    )
}
