import { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, alpha } from '@mui/material';
import { useProductosPorCliente } from '../../hooks/useProductosPorCliente';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import { div } from 'framer-motion/client';

interface Props {
    codigoCliente: string | undefined;
    nombreCliente: string | undefined;
}

const columns: GridColDef[] = [
    {
        field: 'Codigo_Articulo',
        headerName: 'Código',
        flex: 1.2,
        minWidth: 120,
    },
    {
        field: 'Total_Unidades',
        headerName: 'Unidades',
        flex: 0.8,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
    },
    {
        field: 'Total_USD',
        headerName: 'Monto USD',
        flex: 1,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params) => (
            <strong style={{ color: '#1e293b' }}>
                ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </strong>
        ),
    },
    {
        field: 'Total_Facturas',
        headerName: 'Facturas',
        flex: 0.8,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
    },
];

export default function ProductosPorClienteTable({ codigoCliente, nombreCliente }: Props) {
    const { data, isLoading, error } = useProductosPorCliente(codigoCliente);

    const rows = useMemo(() =>
        data.map((item, index) => ({ id: index, ...item })),
        [data]
    );

    return (
        <GraphCardWithFilters
            title='Productos comprados'
            filters={
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {nombreCliente ?? 'Selecciona un cliente'}
                </span>
            }
            graph={
                <div className='top-4 pb-4'>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            width: '100%',
                            height: 350,
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            p: 1,
                            border: '1px solid #E0E4E8',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {error ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        ) : !codigoCliente ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                Selecciona un cliente para ver sus productos
                            </div>
                        ) : (
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                loading={isLoading}
                                disableColumnMenu
                                disableRowSelectionOnClick
                                density="compact"
                                rowHeight={40}
                                columnHeaderHeight={40}
                                initialState={{
                                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                                    sorting: { sortModel: [{ field: 'Total_USD', sort: 'desc' }] },
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
                        )}
                    </Paper>
                </div>
            }
            legend={<></>}
        />
    );
}
