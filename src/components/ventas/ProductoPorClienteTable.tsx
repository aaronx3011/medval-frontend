import { useMemo } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Paper, alpha } from '@mui/material';
import { useProductosPorCliente } from '../../hooks/useProductosPorCliente';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import DownloadCsvButton, { sanitizeFilename } from '../utils/DownloadCsvButton';
import { table, slate, surface, status, component } from '../../config/colors';

interface Props {
    codigoCliente: string | undefined;
    nombreCliente: string | undefined;
    year?: string;
}

const columns: GridColDef[] = [
    {
        field: 'Ref_Articulo',
        headerName: 'Ref',
        flex: 0.8,
        minWidth: 110,
        renderCell: (params) => (
            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: table.cellText, fontWeight: 600 }}>
                {params.value}
            </span>
        ),
    },
    {
        field: 'Descripcion_Articulo',
        headerName: 'Artículo',
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => (
            <span style={{ fontWeight: 500 }}>
                {params.value}
            </span>
        )
    },
    {
        field: 'Total_Unidades',
        headerName: 'Unidades',
        flex: 0.8,
        minWidth: 90,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
    },
    {
        field: 'Total_USD',
        headerName: 'Monto USD',
        flex: 1,
        minWidth: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params) => (
            <strong style={{ color: slate[800] }}>
                ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
        ),
    },
    {
        field: 'Total_Facturas',
        headerName: 'Facturas',
        flex: 0.8,
        minWidth: 90,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
    },
];

export default function ProductosPorClienteTable({ codigoCliente, nombreCliente, year }: Props) {
    const { data, isLoading, error } = useProductosPorCliente(codigoCliente);

    const rows = useMemo(() =>
        data.map((item, index) => ({ id: index, ...item })),
        [data]
    );

    const apiRef = useGridApiRef();

    const csvFilename = [
        'productos-por-cliente',
        codigoCliente,
        nombreCliente ? sanitizeFilename(nombreCliente, '') : '',
        year
    ].filter(Boolean).map(s => sanitizeFilename(s)).join('_') || 'productos-por-cliente';

    return (
        <GraphCardWithFilters
            title='Productos comprados'
            subtitle={year && nombreCliente ? `${year}  ·  ${nombreCliente}` : (nombreCliente ?? 'Selecciona un cliente')}
            actions={<DownloadCsvButton apiRef={apiRef} filename={csvFilename} />}
            filters={<></>}
            graph={
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: surface.white,
                            borderRadius: '8px',
                            p: 1,
                            border: `1px solid ${table.paperBorder}`,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        {error ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: status.errorText, fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        ) : !codigoCliente ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: component.placeholder, fontSize: '0.85rem' }}>
                                Selecciona un cliente para ver sus productos
                            </div>
                        ) : (
                            <DataGrid
                                apiRef={apiRef}
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
                                    flex: 1,
                                    minHeight: 0,
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: table.headerBg,
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        color: slate[800],
                                        textTransform: 'uppercase',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        fontSize: '0.75rem',
                                        color: table.cellText,
                                        borderBottom: `1px solid ${table.cellBorder}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        minHeight: '40px',
                                        height: '40px',
                                        borderTop: `1px solid ${table.cellBorder}`,
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
            }
            legend={<></>}
        />
    );
}
