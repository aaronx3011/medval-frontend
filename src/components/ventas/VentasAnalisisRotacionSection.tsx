import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, InputBase, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Search } from 'lucide-react';

import { useVentasRotacion } from '../../hooks/useInventarioRotacion';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import VentasRotacionProductoAnualChart from './VentasRotacionProductoAnualChart';
import VentasRotacionProductoAnualActualChart from './VentasRotacioPoductoAnualActualChart';

export default function VentasAnalisisRotacionSection() {
    const { data, isLoading, error } = useVentasRotacion();

    // Estados para los filtros y selección
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnio, setSelectedAnio] = useState<string>('');
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    // 1. Extraemos la fila seleccionada
    const selectedRowData = useMemo(() => {
        if (!selectedRowId) return null;
        return data.find(item => item.id === selectedRowId) || null;
    }, [data, selectedRowId]);

    // 2. NUEVO: Extraemos el historial de TODOS LOS AÑOS para el producto seleccionado
    const productHistory = useMemo(() => {
        if (!selectedRowData) return [];
        return data.filter(item => item.Codigo_Articulo === selectedRowData.Codigo_Articulo);
    }, [data, selectedRowData]);

    const uniqueAnios = useMemo(() => {
        const anios = Array.from(new Set(data.map(item => item.Anio)));
        return anios.sort((a, b) => b - a);
    }, [data]);

    useEffect(() => {
        if (uniqueAnios.length > 0 && !selectedAnio) {
            setSelectedAnio(uniqueAnios[0].toString());
        }
    }, [uniqueAnios, selectedAnio]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.Codigo_Articulo.toLowerCase().includes(searchTerm.toLowerCase()) || (item.Descripcion_Articulo?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesAnio = selectedAnio ? item.Anio.toString() === selectedAnio : true;
            return matchesSearch && matchesAnio;
        });
    }, [data, searchTerm, selectedAnio]);

    const handleAnioChange = (event: SelectChangeEvent) => {
        setSelectedAnio(event.target.value);
        setSelectedRowId(null); // Reseteamos la selección al cambiar de año
    };

    const currencyFormatter = (val: any) => {
        const actualValue = val && typeof val === 'object' && 'value' in val ? val.value : val;
        if (actualValue == null || actualValue === 0) return '-';
        return `$${Number(actualValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const columns: GridColDef[] = [
        {
            field: 'Descripcion_Articulo',
            headerName: 'Artículo',
            width: 280,
            renderCell: (params) => (
                <span style={{ fontWeight: 500 }}>
                    {params.value}
                    <span style={{ color: '#94a3b8', marginLeft: 6, fontSize: '0.7rem' }}>
                        {params.row.Codigo_Articulo}
                    </span>
                </span>
            )
        },
        { field: 'Total', headerName: 'Total USD', width: 120, valueFormatter: currencyFormatter, cellClassName: 'font-bold text-slate-800 bg-slate-50' },
        { field: 'Enero', headerName: 'Ene', width: 110, valueFormatter: currencyFormatter },
        { field: 'Febrero', headerName: 'Feb', width: 110, valueFormatter: currencyFormatter },
        { field: 'Marzo', headerName: 'Mar', width: 110, valueFormatter: currencyFormatter },
        { field: 'Abril', headerName: 'Abr', width: 110, valueFormatter: currencyFormatter },
        { field: 'Mayo', headerName: 'May', width: 110, valueFormatter: currencyFormatter },
        { field: 'Junio', headerName: 'Jun', width: 110, valueFormatter: currencyFormatter },
        { field: 'Julio', headerName: 'Jul', width: 110, valueFormatter: currencyFormatter },
        { field: 'Agosto', headerName: 'Ago', width: 110, valueFormatter: currencyFormatter },
        { field: 'Septiembre', headerName: 'Sep', width: 110, valueFormatter: currencyFormatter },
        { field: 'Octubre', headerName: 'Oct', width: 110, valueFormatter: currencyFormatter },
        { field: 'Noviembre', headerName: 'Nov', width: 110, valueFormatter: currencyFormatter },
        { field: 'Diciembre', headerName: 'Dic', width: 110, valueFormatter: currencyFormatter },
    ];

    if (error) {
        return <div className="p-4 text-red-500">Ocurrió un error cargando los datos: {error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <GraphCardWithFilters
                    title='Desglose de Ventas Mensuales por Producto'
                    filters={
                        <div className="flex items-center gap-3">
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', px: 2, py: 0.5, width: 250, height: '36px' }}>
                                <Search size={16} className="text-slate-400 mr-2" />
                                <InputBase
                                    placeholder="Buscar código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ ml: 1, flex: 1, fontSize: '0.85rem' }}
                                />
                            </Box>
                            <Select
                                value={selectedAnio}
                                onChange={handleAnioChange}
                                displayEmpty={false}
                                size="small"
                                sx={{
                                    bgcolor: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    color: '#475569',
                                    borderRadius: '8px',
                                    height: '36px',
                                    fontSize: '0.85rem',
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    '&:hover': { bgcolor: '#F1F5F9' }
                                }}
                            >
                                {uniqueAnios.map(anio => (
                                    <MenuItem sx={{ fontSize: '0.85rem' }} key={anio} value={anio.toString()}>
                                        Año: {anio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    }
                    legend={
                        <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
                            <DataGrid
                                rows={filteredData}
                                columns={columns}
                                loading={isLoading}
                                onRowSelectionModelChange={(newSelection) => {
                                    if (newSelection.length > 0) {
                                        setSelectedRowId(newSelection[0] as string);
                                    } else {
                                        setSelectedRowId(null);
                                    }
                                }}
                                rowSelectionModel={selectedRowId ? [selectedRowId] : []}
                                initialState={{
                                    sorting: { sortModel: [{ field: 'Total', sort: 'desc' }] },
                                }}
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: { xs: '0.65rem', lg: '0.85rem' } },
                                    '& .MuiDataGrid-cell': { fontSize: { xs: '0.65rem', lg: '0.85rem' }, color: '#334155', cursor: 'pointer' },
                                    '& .MuiDataGrid-row:hover': { backgroundColor: '#F1F5F9' },
                                    '& .MuiDataGrid-row.Mui-selected': { backgroundColor: '#E2E8F0' },
                                }}
                            />
                        </div>
                    }
                />

                <div className='flex flex-col gap-4 h-full'>
                    <div className="flex-1 min-h-[300px] w-full">
                        <VentasRotacionProductoAnualActualChart selectedRow={selectedRowData} />
                    </div>
                    <div className="flex-1 min-h-[300px] w-full">
                        <VentasRotacionProductoAnualChart
                            productHistory={productHistory}
                            activeYear={selectedAnio}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
