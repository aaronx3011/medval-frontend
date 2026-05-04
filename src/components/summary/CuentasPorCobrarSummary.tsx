import { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, Typography, CircularProgress, alpha, InputBase } from '@mui/material';
import { Search, X } from 'lucide-react';
import GraphCardWithFilters from '../utils/graphCardWithFilters'; // Asegúrate de que esta ruta coincida con tu proyecto
import { useCuentasPorCobrar } from '../../hooks/useCuentasPorCobrar';

const columns: GridColDef[] = [
    { field: 'Codigo_Cliente', headerName: 'Código Cliente', width: 140 },
    {
        field: 'Deuda_Total_USD',
        headerName: 'Deuda Total',
        type: 'number',
        width: 150,
        renderCell: (params: any) => (
            <strong style={{ color: '#1e293b' }}>
                ${Number(params.value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
        )
    },
    { field: 'Total_Documentos_Pendientes', headerName: 'Facturas Pendientes', type: 'number', width: 140 },
    { field: 'Dias_Maximo_Atraso', headerName: 'Máx. Días Atraso', type: 'number', width: 140 },
    {
        field: 'Vencido_31_A_60_Dias_USD',
        headerName: '31-60 Días',
        type: 'number',
        width: 120,
        valueFormatter: (value: any) => `$${(value ?? 0).toFixed(2)}`
    },
    {
        field: 'Vencido_61_A_90_Dias_USD',
        headerName: '61-90 Días',
        type: 'number',
        width: 120,
        valueFormatter: (value: any) => `$${(value ?? 0).toFixed(2)}`
    },
    {
        field: 'Vencido_Mas_De_90_Dias_USD',
        headerName: '> 90 Días',
        type: 'number',
        width: 120,
        valueFormatter: (value: any) => `$${(value ?? 0).toFixed(2)}`
    },
];

export default function CuentasPorCobrarSummary() {
    const [searchText, setSearchText] = useState('');
    const { data, loading, error } = useCuentasPorCobrar();

    // Filtro para el buscador
    const filteredRows = useMemo(() => {
        if (!data) return [];
        return data.filter((row) => {
            return Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [searchText, data]);

    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <GraphCardWithFilters
            title="Resumen de Cuentas por Cobrar"
            graph={
                <div className="flex flex-col h-full w-full">
                    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
                        <Paper elevation={0} sx={{ height: '100%', width: '100%', border: '1px solid #E0E4E8', borderRadius: '12px', overflow: 'hidden' }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <DataGrid
                                    rows={filteredRows}
                                    columns={columns}
                                    getRowId={(row) => row.Codigo_Cliente}
                                    disableColumnMenu
                                    disableRowSelectionOnClick
                                    density="compact"
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                        // Aquí se aplica el ordenamiento por defecto
                                        sorting: {
                                            sortModel: [{ field: 'Deuda_Total_USD', sort: 'desc' }],
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
                                />
                            )}
                        </Paper>
                    </Box>
                </div>
            }
            filters={
                <Paper
                    elevation={0}
                    sx={{
                        p: '4px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '250px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        border: '1px solid #E0E4E8',
                        '&:focus-within': { borderColor: '#FF6600' }
                    }}
                >
                    <Search size={16} color="#A0AEC0" style={{ marginRight: '8px' }} />
                    <InputBase
                        placeholder="Buscar cliente, monto..."
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
            }
            legend={<></>}
        />
    );
}
