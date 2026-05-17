import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ClientePorProducto } from '../../types/ventas'

// MUI & Icons
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InputBase, Paper, Stack, alpha, Button } from '@mui/material';
import { Search, X, Eye } from 'lucide-react';

interface Props {
    data: ClientePorProducto[];
    isLoading: boolean;
}

export default function VentasTotalesPorPeriodo({ data, isLoading }: Props) {
    const [searchText, setSearchText] = useState('')
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

    // Preparar datos con IDs únicos requeridos por MUI DataGrid
    const rows = useMemo(() => {
        if (!data) return [];
        return data.map((item, index) => ({
            id: index,
            ...item
        }));
    }, [data]);

    // Filtrado de búsqueda de la tabla
    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            return Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [searchText, rows]);

    // Columnas que reflejan el API real
    const columns: GridColDef[] = [
        { field: 'Codigo_Cliente', headerName: 'Cliente', flex: 1.5, minWidth: 140 },
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chart-card mb-4 h-full flex flex-col"
        >
            <h2 className="uppercase font-display text-2xl font-bold text-brand-navy text-left mb-3">
                Clientes por Producto
            </h2>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
                        placeholder="Buscar cliente..."
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
                    minHeight: '300px',
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
                    rows={filteredRows}
                    columns={columns}
                    loading={isLoading}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    density="compact"
                    rowHeight={40}
                    columnHeaderHeight={40}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 15 },
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
                />
            </Paper>
        </motion.div>
    )
}
