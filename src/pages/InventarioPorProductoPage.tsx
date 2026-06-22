import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Paper, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useInventarioPorProducto } from '../hooks/useInventarioPorProducto';

export default function InventarioPorProductoPage() {
    const { data, isLoading } = useInventarioPorProducto();

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
            field: 'Total_Valor_Venta_USD',
            headerName: 'Valor Venta USD',
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
            field: 'Total_Valor_Costo_USD',
            headerName: 'Valor Costo USD',
            flex: 1,
            minWidth: 120,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => (
                <span style={{ color: '#475569' }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
            ),
        },
        {
            field: 'ganancia',
            headerName: 'Ganancia USD',
            flex: 1,
            minWidth: 120,
            type: 'number' as const,
            align: 'left' as const,
            headerAlign: 'left' as const,
            renderCell: (params: any) => {
                const ganancia = (params.row.Total_Valor_Venta_USD ?? 0) - (params.row.Total_Valor_Costo_USD ?? 0);
                return (
                    <strong style={{ color: ganancia >= 0 ? '#16a34a' : '#dc2626' }}>
                        ${ganancia.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="chart-card"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="uppercase font-display text-xl lg:text-2xl font-bold text-brand-navy">
                            Inventario por Producto
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium">
                            Stock agregado por producto
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
                        rows={data}
                        columns={columns}
                        loading={isLoading}
                        disableColumnMenu
                        disableRowSelectionOnClick
                        density="compact"
                        rowHeight={40}
                        columnHeaderHeight={40}
                        getRowId={(row) => row.Codigo_Articulo}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'Total_Unidades', sort: 'desc' }],
                            },
                            pagination: {
                                paginationModel: { page: 0, pageSize: 15 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 15, 25, 50]}
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
            </motion.div>
        </motion.main>
    );
}
