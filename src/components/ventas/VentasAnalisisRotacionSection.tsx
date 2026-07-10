import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Box, InputBase, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Search } from 'lucide-react';

import { useVentasRotacion } from '../../hooks/useInventarioRotacion';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import DownloadCsvButton, { sanitizeFilename } from '../utils/DownloadCsvButton';
import VentasRotacionProductoAnualChart from './VentasRotacionProductoAnualChart';
import VentasRotacionProductoAnualActualChart from './VentasRotacioPoductoAnualActualChart';
import { custom, slate, table } from '../../config/colors';

export default function VentasAnalisisRotacionSection() {
    const { data, isLoading, error } = useVentasRotacion();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnio, setSelectedAnio] = useState<string>('');
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [columnView, setColumnView] = useState<'todo' | 'usd' | 'unidades'>('todo');

    const selectedRowData = useMemo(() => {
        if (!selectedRowId) return null;
        return data.find(item => item.id === selectedRowId) || null;
    }, [data, selectedRowId]);

    const productHistory = useMemo(() => {
        if (!selectedRowData) return [];
        return data.filter(item => item.Codigo_Articulo === selectedRowData.Codigo_Articulo);
    }, [data, selectedRowData]);

    const apiRef = useGridApiRef();

    const csvFilename = [
        'rotacion-mensual',
        selectedAnio,
        searchTerm
    ].filter(Boolean).map(s => sanitizeFilename(s)).join('_') || 'rotacion-mensual';

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
            const matchesSearch = item.Codigo_Articulo.toLowerCase().includes(searchTerm.toLowerCase()) || (item.Ref_Articulo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (item.Descripcion_Articulo?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesAnio = selectedAnio ? item.Anio.toString() === selectedAnio : true;
            return matchesSearch && matchesAnio;
        });
    }, [data, searchTerm, selectedAnio]);

    const handleAnioChange = (event: SelectChangeEvent) => {
        setSelectedAnio(event.target.value);
        setSelectedRowId(null);
    };

    const currencyFormatter = (val: any) => {
        const actualValue = val && typeof val === 'object' && 'value' in val ? val.value : val;
        if (actualValue == null || actualValue === 0) return '-';
        return `$${Number(actualValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const unitsFormatter = (val: any) => {
        const actualValue = val && typeof val === 'object' && 'value' in val ? val.value : val;
        if (actualValue == null || actualValue === 0) return '-';
        return Number(actualValue).toLocaleString('en-US');
    };

    const fixedFields = ['Ref_Articulo', 'Descripcion_Articulo'];

    const allColumns: GridColDef[] = [
        {
            field: 'Ref_Articulo',
            headerName: 'Ref',
            width: 120,
            renderCell: (params) => (
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: custom.selectText, fontWeight: 600 }}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'Descripcion_Articulo',
            headerName: 'Artículo',
            width: 240,
            renderCell: (params) => (
                <span style={{ fontWeight: 500 }}>
                    {params.value}
                </span>
            )
        },
        { field: 'Total', headerName: 'Total USD', width: 120, valueFormatter: currencyFormatter, cellClassName: 'font-bold text-slate-800 bg-slate-50' },
        { field: 'Total_Unidades', headerName: 'Total Und', width: 120, valueFormatter: unitsFormatter, cellClassName: 'font-bold text-slate-800 bg-slate-50' },
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
        { field: 'Enero_Unidades', headerName: 'Ene u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Febrero_Unidades', headerName: 'Feb u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Marzo_Unidades', headerName: 'Mar u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Abril_Unidades', headerName: 'Abr u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Mayo_Unidades', headerName: 'May u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Junio_Unidades', headerName: 'Jun u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Julio_Unidades', headerName: 'Jul u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Agosto_Unidades', headerName: 'Ago u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Septiembre_Unidades', headerName: 'Sep u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Octubre_Unidades', headerName: 'Oct u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Noviembre_Unidades', headerName: 'Nov u', width: 100, valueFormatter: unitsFormatter },
        { field: 'Diciembre_Unidades', headerName: 'Dic u', width: 100, valueFormatter: unitsFormatter },
    ];

    const columnVisibilityModel = useMemo(() => {
        if (columnView === 'todo') return {};
        const hidden: Record<string, boolean> = {};
        allColumns.forEach(col => {
            if (fixedFields.includes(col.field)) return;
            if (columnView === 'usd' && col.field.endsWith('_Unidades')) hidden[col.field] = false;
            if (columnView === 'unidades' && !col.field.endsWith('_Unidades')) hidden[col.field] = false;
        });
        return hidden;
    }, [columnView]);

    const sortModel = useMemo(() => [{
        field: columnView === 'unidades' ? 'Total_Unidades' : 'Total',
        sort: 'desc' as const,
    }], [columnView]);

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
                    actions={<DownloadCsvButton apiRef={apiRef} filename={csvFilename} />}
                    graph={<div />}
                    filters={
                        <div className="flex items-center gap-3">
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: custom.searchBoxBg, border: `1px solid ${custom.searchBoxBorder}`, borderRadius: '8px', px: 2, py: 0.5, width: 250, height: '36px' }}>
                                <Search size={16} className="text-slate-400 mr-2" />
                                <InputBase
                                    placeholder="Buscar código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ ml: 1, flex: 1, fontSize: '0.85rem' }}
                                />
                            </Box>
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                                <button onClick={() => setColumnView('todo')} className={`px-2 py-1 text-xs rounded-md transition-colors ${columnView === 'todo' ? 'bg-white shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                                    Todo
                                </button>
                                <button onClick={() => setColumnView('usd')} className={`px-2 py-1 text-xs rounded-md transition-colors ${columnView === 'usd' ? 'bg-white shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                                    $
                                </button>
                                <button onClick={() => setColumnView('unidades')} className={`px-2 py-1 text-xs rounded-md transition-colors ${columnView === 'unidades' ? 'bg-white shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                                    Und
                                </button>
                            </div>
                            <Select
                                value={selectedAnio}
                                onChange={handleAnioChange}
                                displayEmpty={false}
                                size="small"
                                sx={{
                                    bgcolor: custom.searchBoxBg,
                                    border: `1px solid ${custom.searchBoxBorder}`,
                                    color: custom.selectText,
                                    borderRadius: '8px',
                                    height: '36px',
                                    fontSize: '0.85rem',
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    '&:hover': { bgcolor: table.cellBorder }
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
                                apiRef={apiRef}
                                rows={filteredData}
                                columns={allColumns}
                                columnVisibilityModel={columnVisibilityModel}
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
                                    sorting: { sortModel },
                                }}
                                key={columnView}
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': { backgroundColor: custom.searchBoxBg, color: custom.selectText, fontWeight: 600, fontSize: { xs: '0.65rem', lg: '0.85rem' } },
                                    '& .MuiDataGrid-cell': { fontSize: { xs: '0.65rem', lg: '0.85rem' }, color: slate[700], cursor: 'pointer' },
                                    '& .MuiDataGrid-row:hover': { backgroundColor: table.cellBorder },
                                    '& .MuiDataGrid-row.Mui-selected': { backgroundColor: slate[200] },
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
