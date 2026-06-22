import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Select, MenuItem, SelectChangeEvent, Paper, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useInventarioCompleto } from '../hooks/useInventarioCompleto';

type ViewMode = 'units' | 'usd' | 'products';

const SOFT_COLORS = [
    '#0D0A6E',
    '#2D25D4',
    '#5650D4',
    '#8B86E0',
    '#B8B5EC',
    '#E53E0A',
    '#E8693A',
    '#EF9B76',
    '#F5C9A8',
    '#8C8C8C',
    '#B0B0B0',
    '#D0D0D0',
    '#EBEBEB',
];

const getPrefixColor = (() => {
    const cache: Record<string, string> = {};
    let index = 0;
    return (prefix: string) => {
        if (!cache[prefix]) {
            cache[prefix] = SOFT_COLORS[index % SOFT_COLORS.length];
            index++;
        }
        return cache[prefix];
    };
})();

interface CustomNodeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    value: number;
    prefix: string;
    viewMode: ViewMode;
    depth: number;
}

function CustomNode(props: CustomNodeProps) {
    const { x, y, width, height, name, value, prefix, viewMode } = props;

    const fill = getPrefixColor(prefix);
    const tooSmall = width < 30 || height < 20;

    const label =
        viewMode === 'units' || viewMode === 'products'
            ? `${value.toLocaleString()} u`
            : `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const clipId = `clip-${name.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <g>
            <defs>
                <clipPath id={clipId}>
                    <rect x={x + 4} y={y + 4} width={Math.max(0, width - 8)} height={Math.max(0, height - 8)} />
                </clipPath>
            </defs>

            <rect
                x={x + 1}
                y={y + 1}
                width={width - 2}
                height={height - 2}
                rx={0}
                ry={0}
                fill={fill}
                stroke="#fff"
                strokeWidth={2}
            />

            {!tooSmall && (
                <g clipPath={`url(#${clipId})`}>
                    <text
                        x={x + 8}
                        y={y + height / 2 - 7}
                        fill="#fff"
                        fontSize={10}
                        fontWeight={700}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                        {name}
                    </text>
                    <text
                        x={x + 8}
                        y={y + height / 2 + 7}
                        fill="rgba(255,255,255,0.85)"
                        fontSize={10}
                        fontWeight={500}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                        {label}
                    </text>
                </g>
            )}
        </g>
    );
}

interface TooltipPayloadItem {
    payload: {
        name: string;
        descripcion?: string;
        value: number;
        prefix: string;
    };
}

function CustomTooltip({ active, payload, viewMode }: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    viewMode: ViewMode;
}) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    if (!d.descripcion) return null;

    return (
        <div style={{
            background: '#1e293b',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '0.78rem',
            maxWidth: 260,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
            <p style={{ fontWeight: 700, marginBottom: 4, color: getPrefixColor(d.prefix) }}>{d.name}</p>
            <p style={{ color: '#94a3b8', marginBottom: 6 }}>{d.descripcion}</p>
            <p style={{ fontWeight: 600 }}>
                {viewMode === 'units' || viewMode === 'products'
                    ? `${d.value.toLocaleString()} unidades`
                    : `$${d.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
                }
            </p>
        </div>
    );
}

export default function InventarioTreemap() {
    const { data, isLoading, error } = useInventarioCompleto();
    const [viewMode, setViewMode] = useState<ViewMode>('units');

    const warehouseRows = useMemo(() => {
        if (!data.length) return [];

        const groups: Record<string, { unidades: number; usd: number }> = {};

        for (const item of data) {
            const almacen = item.Nombre_Almacen || 'SIN ALMACÉN';
            if (!groups[almacen]) {
                groups[almacen] = { unidades: 0, usd: 0 };
            }
            groups[almacen].unidades += item.Unidades ?? 0;
            groups[almacen].usd += item.Total_Ultimo_Precio_Venta_USD ?? 0;
        }

        const totalUnidades = Object.values(groups).reduce((s, g) => s + g.unidades, 0);
        const totalUSD = Object.values(groups).reduce((s, g) => s + g.usd, 0);

        return Object.entries(groups)
            .map(([almacen, vals]) => ({
                id: almacen,
                almacen,
                unidades: vals.unidades,
                usd: vals.usd,
                pctUnidades: totalUnidades > 0 ? (vals.unidades / totalUnidades) * 100 : 0,
                pctUSD: totalUSD > 0 ? (vals.usd / totalUSD) * 100 : 0,
            }))
            .filter(row => row.unidades > 0);
    }, [data]);

    const productRows = useMemo(() => {
        if (!data.length) return [];

        const groups: Record<string, { nombre: string; unidades: number; usd: number }> = {};

        for (const item of data) {
            const codigo = item.Codigo_Articulo;
            if (!groups[codigo]) {
                groups[codigo] = { nombre: item.Nombre_Articulo, unidades: 0, usd: 0 };
            }
            groups[codigo].unidades += item.Unidades ?? 0;
            groups[codigo].usd += item.Total_Ultimo_Precio_Venta_USD ?? 0;
        }

        const totalUnidades = Object.values(groups).reduce((s, g) => s + g.unidades, 0);

        return Object.entries(groups)
            .map(([codigo, vals]) => ({
                id: codigo,
                codigo,
                nombre: vals.nombre,
                unidades: vals.unidades,
                usd: vals.usd,
                pctUnidades: totalUnidades > 0 ? (vals.unidades / totalUnidades) * 100 : 0,
            }))
            .filter(row => row.unidades > 0);
    }, [data]);

    const treeData = useMemo(() => {
        if (viewMode === 'products') {
            return productRows.map(p => ({
                name: p.nombre,
                descripcion: p.codigo,
                value: p.unidades,
                prefix: p.codigo,
            })).filter(item => item.value > 0);
        }
        return warehouseRows.map(w => ({
            name: w.almacen,
            descripcion: w.almacen,
            value: viewMode === 'units' ? w.unidades : w.usd,
            prefix: w.almacen,
        })).filter(item => item.value > 0);
    }, [warehouseRows, productRows, viewMode]);

    const warehouseColumns = useMemo(() => [
        {
            field: 'almacen',
            headerName: 'Almacén',
            flex: 1.5,
            minWidth: 140,
            renderCell: (params: any) => (
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'unidades',
            headerName: 'Unidades',
            flex: 1,
            minWidth: 100,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
        },
        {
            field: 'usd',
            headerName: 'Valor USD',
            flex: 1,
            minWidth: 120,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => (
                <strong style={{ color: '#1e293b' }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
            ),
        },
        {
            field: 'pct',
            headerName: '% del Total',
            flex: 0.8,
            minWidth: 100,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => {
                const pct = viewMode === 'units' ? params.row.pctUnidades : params.row.pctUSD;
                return (
                    <span style={{ color: '#475569', fontWeight: 500 }}>
                        {pct.toFixed(1)}%
                    </span>
                );
            },
        },
    ], [viewMode]);

    const productColumns = useMemo(() => [
        {
            field: 'codigo',
            headerName: 'Código',
            flex: 1,
            minWidth: 110,
            renderCell: (params: any) => (
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'nombre',
            headerName: 'Producto',
            flex: 2,
            minWidth: 200,
        },
        {
            field: 'unidades',
            headerName: 'Unidades',
            flex: 0.8,
            minWidth: 100,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
        },
        {
            field: 'usd',
            headerName: 'Valor USD',
            flex: 1,
            minWidth: 120,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => (
                <strong style={{ color: '#1e293b' }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
            ),
        },
        {
            field: 'pct',
            headerName: '% del Total',
            flex: 0.8,
            minWidth: 100,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => (
                <span style={{ color: '#475569', fontWeight: 500 }}>
                    {params.row.pctUnidades.toFixed(1)}%
                </span>
            ),
        },
    ], []);

    const handleViewModeChange = (event: SelectChangeEvent) => {
        setViewMode(event.target.value as ViewMode);
    };

    const subtitleMap: Record<ViewMode, string> = {
        units: 'Medido en - Unidades',
        usd: 'Medido en - USD',
        products: 'Por Producto',
    };

    const tableTitleMap: Record<ViewMode, string> = {
        units: 'Resumen por Almacén',
        usd: 'Resumen por Almacén',
        products: 'Resumen por Producto',
    };

    const isWarehouseMode = viewMode === 'units' || viewMode === 'usd';
    const tableRows = isWarehouseMode ? warehouseRows : productRows;
    const tableColumns = isWarehouseMode ? warehouseColumns : productColumns;

    const totals = useMemo(() => {
        const sumUnidades = tableRows.reduce((acc, r) => acc + (r.unidades || 0), 0);
        const sumUSD = tableRows.reduce((acc, r) => acc + (r.usd || 0), 0);
        return { sumUnidades, sumUSD };
    }, [tableRows]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            {/* Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="chart-card mb-4"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div>
                        <h2 className="uppercase font-display text-xl lg:text-2xl font-bold text-brand-navy text-left">
                            Inventario
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium">
                            {subtitleMap[viewMode]}
                        </p>
                    </div>

                    <Select
                        value={viewMode}
                        onChange={handleViewModeChange}
                        size="small"
                        sx={{
                            bgcolor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            color: '#475569',
                            borderRadius: '8px',
                            height: '36px',
                            fontSize: '0.85rem',
                            minWidth: 140,
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&:hover': { bgcolor: '#F1F5F9' },
                        }}
                    >
                        <MenuItem sx={{ fontSize: '0.85rem' }} value="units">Unidades</MenuItem>
                        <MenuItem sx={{ fontSize: '0.85rem' }} value="usd">USD</MenuItem>
                        <MenuItem sx={{ fontSize: '0.85rem' }} value="products">Productos</MenuItem>
                    </Select>
                </div>

                <div style={{ width: '100%', height: 560 }}>
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            Cargando inventario...
                        </div>
                    ) : error ? (
                        <div className="flex h-full items-center justify-center text-sm text-red-500">
                            {error}
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                                data={treeData}
                                dataKey="value"
                                aspectRatio={4 / 3}
                                content={(props: any) => (
                                    <CustomNode {...props}
                                        viewMode={viewMode}
                                    />
                                )}
                            >
                                <Tooltip
                                    content={<CustomTooltip viewMode={viewMode} />}
                                />
                            </Treemap>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>

            {/* Table Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="chart-card"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="uppercase font-display text-xl lg:text-2xl font-bold text-brand-navy">
                            {tableTitleMap[viewMode]}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium">
                            {subtitleMap[viewMode]}
                        </p>
                    </div>
                </div>

                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        p: 1,
                        border: '1px solid #E0E4E8',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <DataGrid
                        rows={tableRows as any}
                        columns={tableColumns}
                        loading={isLoading}
                        disableColumnMenu
                        disableRowSelectionOnClick
                        density="compact"
                        rowHeight={40}
                        columnHeaderHeight={40}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: viewMode === 'products' ? 'unidades' : (viewMode === 'usd' ? 'usd' : 'unidades'), sort: 'desc' }],
                            },
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 20, 50]}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f8fafc',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                color: '#1e293b',
                                textTransform: 'uppercase',
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '0.75rem',
                                color: '#475569',
                                borderBottom: '1px solid #F1F5F9',
                                display: 'flex',
                                alignItems: 'center',
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
                                borderRadius: '10px',
                            },
                        }}
                    />
                </Paper>

                <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wide">Totales</span>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                        <span>
                            Unidades:{' '}
                            <strong className="text-slate-800">
                                {totals.sumUnidades.toLocaleString('en-US')}
                            </strong>
                        </span>
                        <span className="hidden lg:inline text-slate-200">|</span>
                        <span>
                            Valor USD:{' '}
                            <strong className="text-slate-800">
                                ${totals.sumUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </strong>
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.main>
    );
}
