import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Box, InputBase, Button, Paper, Stack, alpha } from '@mui/material';
import { Search, X } from 'lucide-react';
import { useInventarioPorProducto } from '../hooks/useInventarioPorProducto';
import DownloadCsvButton, { sanitizeFilename } from '../components/utils/DownloadCsvButton';

export default function InventarioPorProductoPage() {
    const { data, isLoading } = useInventarioPorProducto();
    const [searchText, setSearchText] = useState('');

    const rows = useMemo(() =>
        data.map((item, index) => ({ id: index, ...item })),
        [data]
    );

    const filteredRows = useMemo(() => {
        if (!searchText) return rows;
        const q = searchText.toLowerCase();
        return rows.filter((row) =>
            Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(q)
            )
        );
    }, [rows, searchText]);

    const totals = useMemo(() => {
        const sumUnidades = filteredRows.reduce((acc, r) => acc + (r.Total_Unidades || 0), 0);
        const sumTotalVenta = filteredRows.reduce((acc, r) => acc + (r.Total_Valor_Venta_USD || 0), 0);
        const sumTotalCosto = filteredRows.reduce((acc, r) => acc + (r.Total_Valor_Costo_USD || 0), 0);
        return { sumUnidades, sumTotalVenta, sumTotalCosto };
    }, [filteredRows]);

    const apiRef = useGridApiRef();

    const csvFilename = ['inventario-productos', searchText].filter(Boolean).map(s => sanitizeFilename(s)).join('_');

    const columns = useMemo(() => [
        {
            field: 'Codigo_Articulo',
            headerName: 'Código',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params: any) => (
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'Nombre_Articulo',
            headerName: 'Producto',
            flex: 2,
            minWidth: 200,
        },
        {
            field: 'Almacenes_Distintos',
            headerName: 'Almacenes',
            flex: 0.6,
            minWidth: 80,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
        },
        {
            field: 'Total_Unidades',
            headerName: 'Unidades',
            flex: 0.7,
            minWidth: 80,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
        },
        {
            field: 'Proximo_Vencimiento',
            headerName: 'Próx. Venc.',
            flex: 0.9,
            minWidth: 100,
            renderCell: (params: any) => {
                if (!params.value) return <span style={{ color: '#A0AEC0' }}>—</span>;
                const expiry = new Date(params.value);
                const isExpired = expiry < new Date();
                return (
                    <span style={{ color: isExpired ? '#EF4444' : 'inherit', fontWeight: isExpired ? 600 : 'inherit' }}>
                        {expiry.toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                );
            },
        },
        {
            field: 'Total_Valor_Venta_USD',
            headerName: 'Valor Venta USD',
            flex: 1,
            minWidth: 120,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => (
                <strong style={{ color: '#1e293b' }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
            ),
        },
        {
            field: 'Total_Valor_Costo_USD',
            headerName: 'Valor Costo USD',
            flex: 1,
            minWidth: 120,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => (
                <span style={{ color: '#475569' }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            ),
        },
        {
            field: 'margen',
            headerName: 'Margen %',
            flex: 0.8,
            minWidth: 100,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            valueGetter: (_: any, row: any) => {
                const venta = row.Total_Valor_Venta_USD ?? 0;
                const costo = row.Total_Valor_Costo_USD ?? 0;
                if (venta === 0) return 0;
                return ((venta - costo) / venta) * 100;
            },
            renderCell: (params: any) => {
                const margen = params.value;
                return (
                    <strong style={{ color: margen >= 0 ? '#16a34a' : '#dc2626' }}>
                        {margen.toFixed(1)}%
                    </strong>
                );
            },
        },
    ], []);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full h-full overflow-y-auto p-4 lg:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col w-full gap-4"
            >
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #E0E4E8',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                    }}
                >
                    <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                        <div>
                            <h3 className="text-sm font-bold text-brand-orange uppercase tracking-wider">
                                Productos
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">
                                Stock agregado por producto
                            </p>
                        </div>
                        <DownloadCsvButton apiRef={apiRef} filename={csvFilename} />
                    </div>

                    <Stack sx={{ px: 2, pb: 2, flexShrink: 0, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                width: { xs: '100%', sm: 260 },
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                                border: '1px solid #E0E4E8',
                                transition: 'all 0.2s',
                                '&:focus-within': { borderColor: '#FF6600', boxShadow: '0 4px 12px rgba(255,102,0,0.08)' }
                            }}
                        >
                            <Search size={18} color="#A0AEC0" style={{ marginRight: '10px' }} />
                            <InputBase
                                placeholder="Buscar productos..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                sx={{ fontSize: '0.9rem', flex: 1, fontWeight: 500 }}
                            />
                            {searchText && (
                                <X size={16} color="#A0AEC0" style={{ cursor: 'pointer' }} onClick={() => setSearchText('')} />
                            )}
                        </Paper>

                        {searchText && (
                            <Button
                                startIcon={<X size={16} />}
                                onClick={() => setSearchText('')}
                                sx={{ color: '#718096', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: '#FF6600' }, alignSelf: { xs: 'flex-start', sm: 'center' } }}
                            >
                                Limpiar
                            </Button>
                        )}
                    </Stack>

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: { xs: 400, sm: 0 },
                            mx: 2,
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '14px',
                            border: '1px solid #E0E4E8',
                            overflow: 'hidden',
                        }}
                    >
                        <DataGrid
                            apiRef={apiRef}
                            rows={filteredRows}
                            columns={columns}
                            loading={isLoading}
                            disableColumnMenu
                            disableRowSelectionOnClick
                            getRowId={(row) => row.Codigo_Articulo}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'Total_Unidades', sort: 'desc' }],
                                },
                                pagination: {
                                    paginationModel: { pageSize: 10, page: 0 }
                                }
                            }}
                            pageSizeOptions={[10, 20, 50, 100]}
                            sx={{
                                flex: 1,
                                border: 'none',
                                '& .MuiDataGrid-columnHeaders': {
                                    borderBottom: '1px solid #F1F3F5',
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    color: '#2D3748',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px'
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #F1F3F5',
                                    fontSize: '0.65rem',
                                    color: '#4A5568',
                                    py: 1
                                },
                                '& .MuiDataGrid-columnSeparator': { display: 'none' },
                                '& .MuiDataGrid-footerContainer': { borderTop: 'none' },
                                '& ::-webkit-scrollbar': { width: '6px' },
                                '& ::-webkit-scrollbar-thumb': {
                                    backgroundColor: alpha('#000', 0.05),
                                    borderRadius: '10px'
                                },
                            }}
                        />
                    </Paper>
                </Paper>

                {filteredRows.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1.5, sm: 1.5 },
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: { xs: 2, sm: 2, lg: 4 },
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            border: '1px solid #E0E4E8',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                            fontSize: { xs: '0.8rem', sm: '0.85rem' },
                            fontWeight: 600,
                            color: '#4A5568',
                            flexShrink: 0,
                        }}
                    >
                        <Box sx={{ width: { xs: '100%', sm: '100%', lg: 'auto' }, textAlign: { xs: 'center', sm: 'left', lg: 'left' }, mb: { xs: 0.5, sm: 0.5, lg: 0 }, mr: { lg: 'auto' } }}>
                            <span style={{ color: '#FF6600', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.3px' }}>TOTALES</span>
                        </Box>

                        <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '1px', height: 28, backgroundColor: '#E0E4E8' }} />

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'auto' } }}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexDirection: 'row', gap: 4 }}>
                                <span style={{ whiteSpace: 'nowrap' }}>Unidades:</span>
                                <strong style={{ fontSize: '0.95rem', color: '#2D3748' }}>
                                    {totals.sumUnidades.toLocaleString('en-US')}
                                </strong>
                            </Box>
                        </Box>

                        <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '1px', height: 28, backgroundColor: '#E0E4E8' }} />

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'auto' } }}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexDirection: 'row', gap: 4 }}>
                                <span style={{ whiteSpace: 'nowrap' }}>Total Venta:</span>
                                <strong style={{ fontSize: '0.95rem', color: '#2D3748' }}>
                                    ${totals.sumTotalVenta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </Box>
                        </Box>

                        <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '1px', height: 28, backgroundColor: '#E0E4E8' }} />

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'auto' } }}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexDirection: 'row', gap: 4 }}>
                                <span style={{ whiteSpace: 'nowrap' }}>Total Costo:</span>
                                <strong style={{ fontSize: '0.95rem', color: '#2D3748' }}>
                                    ${totals.sumTotalCosto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </motion.div>
        </motion.main>
    );
}
