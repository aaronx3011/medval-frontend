import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import VentasPorProductoChart from './ventasPorProductoChart';
import { VentaProducto } from '../../types/ventas';

// MUI & Icons
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { InputBase, Paper, Stack, alpha } from '@mui/material';
import { Search, X } from 'lucide-react';
import DownloadCsvButton, { sanitizeFilename } from '../utils/DownloadCsvButton';

interface VentasPorProductoProps {
    selectedProduct: string;
    onSelectProduct: (codigo: string) => void;
    ventasData: VentaProducto[];
    isLoadingVentas: boolean;
    period?: string;
    selectedProductName?: string;
}

export default function VentasPorProducto({ selectedProduct, onSelectProduct, ventasData, isLoadingVentas, period, selectedProductName }: VentasPorProductoProps) {
    const [searchText, setSearchText] = useState('');

    const apiRef = useGridApiRef();

    const csvFilename = [
        'ventas-por-producto',
        searchText
    ].filter(Boolean).map(s => sanitizeFilename(s)).join('_') || 'ventas-por-producto';

    const data = ventasData;
    const isLoading = isLoadingVentas;

    useEffect(() => {
        if (data && data.length > 0 && !selectedProduct) {
            const topProduct = [...data].sort((a, b) => b.Total_USD - a.Total_USD)[0];
            if (topProduct) {
                onSelectProduct(topProduct.Codigo_Articulo);
            }
        }
    }, [data, selectedProduct, onSelectProduct]);

    const rows = useMemo(() => {
        return data.map((item, index) => ({
            id: index,
            ...item
        }));
    }, [data]);

    const columns: GridColDef[] = [
        {
            field: 'Codigo_Articulo',
            headerName: 'Código',
            flex: 0.8,
            minWidth: 110,
            renderCell: (params) => (
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'Descripcion_Articulo',
            headerName: 'Artículo',
            flex: 1.5,
            minWidth: 160,
            renderCell: (params) => (
                <span style={{ fontWeight: 500 }}>
                    {params.value}
                </span>
            )
        },
        { field: 'Total_Unidades', headerName: 'Unidades', flex: 0.8, minWidth: 90, type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'Total_Facturas', headerName: 'Facturas', flex: 0.8, minWidth: 90, type: 'number' },
        {
            field: 'Total_USD',
            headerName: 'Monto $',
            flex: 1,
            minWidth: 110,
            renderCell: (params) => (
                <strong style={{ color: '#1e293b' }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
            )
        },
    ];

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            return Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [searchText, rows]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chart-card mb-4"
        >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="uppercase font-display text-2xl font-bold text-brand-navy text-left">
                        Ventas por Producto
                    </h2>
                    <div className="flex items-center gap-1">
                        <DownloadCsvButton apiRef={apiRef} filename={csvFilename} />
                    </div>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[560px]">
                <div className="flex flex-col h-full w-full">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexShrink: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: '4px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '10px',
                                border: '1px solid #E0E4E8',
                                '&:focus-within': { borderColor: '#FF6600' }
                            }}
                        >
                            <Search size={16} color="#A0AEC0" style={{ marginRight: '8px' }} />
                            <InputBase
                                placeholder="Buscar artículo..."
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
                    </Stack>

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            p: 1,
                            border: '1px solid #E0E4E8',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <DataGrid
                            apiRef={apiRef}
                            rows={filteredRows}
                            columns={columns}
                            loading={isLoading}
                            disableColumnMenu
                            density="compact"
                            rowHeight={40}
                            columnHeaderHeight={40}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 15 },
                                },
                                sorting: {
                                    sortModel: [{ field: 'Total_USD', sort: 'desc' }],
                                },
                            }}
                            pagination
                            onRowClick={(params) => onSelectProduct(params.row.Codigo_Articulo)}
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
                                '& .MuiDataGrid-row': { cursor: 'pointer' },
                            }}
                        />
                    </Paper>
                </div>

                <div className="h-full min-h-[350px] lg:min-h-0">
                    <VentasPorProductoChart product={selectedProduct} period={period} selectedProductName={selectedProductName} />
                </div>
            </div>
        </motion.div>
    )
}
