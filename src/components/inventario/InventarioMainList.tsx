import React, { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, InputBase, Button, Paper, Stack, Menu, MenuItem, alpha, Switch, FormControlLabel } from '@mui/material';
import { Search, ChevronDown, X } from 'lucide-react';
import GraphCardWithFilters from '../utils/graphCardWithFilters';
import { useInventario } from '../../hooks/useInventario';

const columns = [
    { field: 'Codigo_Articulo', headerName: 'Código', flex: 1, minWidth: 100 },
    { field: 'Nombre_Articulo', headerName: 'Artículo', flex: 2, minWidth: 180 },
    { field: 'Codigo_Almacen', headerName: 'Cód. Almacén', flex: 1, minWidth: 100 },
    { field: 'Nombre_Almacen', headerName: 'Almacén', flex: 1.2, minWidth: 120 },
    { field: 'Unidades', headerName: 'Unidades', flex: 0.8, type: 'number', align: 'left', headerAlign: 'left' },
    {
        field: 'Fecha_Vencimiento',
        headerName: 'Vencimiento',
        flex: 1,
        minWidth: 110,
        valueFormatter: (value: string | null) => {
            if (!value) return '—';
            return new Date(value).toLocaleDateString('es-VE', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
        },
        renderCell: (params) => {
            if (!params.value) return '—';
            const expiry = new Date(params.value);
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
            const isSoon = expiry <= sixMonthsFromNow;
            return (
                <span style={{ color: isSoon ? '#EF4444' : 'inherit', fontWeight: isSoon ? 600 : 'inherit' }}>
                    {expiry.toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </span>
            );
        }
    },
    { field: 'Lote', headerName: 'Lote', flex: 1, minWidth: 100 },
    {
        field: 'Ultimo_Precio_Venta_USD',
        headerName: 'Precio USD',
        flex: 1,
        minWidth: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        valueFormatter: (value: number | null) =>
            value != null ? `$${value.toFixed(2)}` : '—'
    },
    {
        field: 'Ultimo_Costo_Compra_USD',
        headerName: 'Costo USD',
        flex: 1,
        minWidth: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        valueFormatter: (value: number | null) =>
            value != null ? `$${value.toFixed(2)}` : '—'
    },
];

export default function InventarioMainList() {
    const { data, isLoading, error } = useInventario();

    const [searchText, setSearchText] = useState('');
    const [loteSearch, setLoteSearch] = useState('');
    const [selectedAlmacen, setSelectedAlmacen] = useState('');
    const [anchorElAlmacen, setAnchorElAlmacen] = useState<null | HTMLElement>(null);
    const [showVencido, setShowVencido] = useState(false);

    const rows = useMemo(() =>
        data.map((item, index) => ({ id: index, ...item })),
        [data]
    );

    const uniqueAlmacenes = useMemo(() =>
        [...new Set(data.map(r => r.Nombre_Almacen))]
            .filter(a => showVencido ? true : a !== 'VENCIDO')
            .sort(),
        [data, showVencido]
    );

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const matchesSearch = Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(searchText.toLowerCase())
            );
            const matchesAlmacen = selectedAlmacen ? row.Nombre_Almacen === selectedAlmacen : true;
            const matchesLote = loteSearch
                ? row.Lote?.toLowerCase().includes(loteSearch.toLowerCase())
                : true;
            const matchesVencido = showVencido ? true : row.Codigo_Almacen !== 'A_VENC';
            return matchesSearch && matchesAlmacen && matchesLote && matchesVencido;
        });
    }, [rows, searchText, selectedAlmacen, loteSearch, showVencido]);

    const hasActiveFilters = selectedAlmacen || loteSearch || searchText;

    return (
        <GraphCardWithFilters
            title=' Inventario '
            graph={
                <div className="flex flex-col h-full w-full">
                    {/* Filter Bar */}
                    <Stack sx={{ mb: 3, flexShrink: 0, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>

                        {/* General search */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                width: { xs: '100%', sm: 260 },
                                backgroundColor: '#FFFFFF',
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

                        {/* Lote search */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                width: { xs: '100%', sm: 200 },
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E0E4E8',
                                transition: 'all 0.2s',
                                '&:focus-within': { borderColor: '#FF6600', boxShadow: '0 4px 12px rgba(255,102,0,0.08)' }
                            }}
                        >
                            <Search size={18} color="#A0AEC0" style={{ marginRight: '10px' }} />
                            <InputBase
                                placeholder="Buscar lote..."
                                value={loteSearch}
                                onChange={(e) => setLoteSearch(e.target.value)}
                                sx={{ fontSize: '0.9rem', flex: 1, fontWeight: 500 }}
                            />
                            {loteSearch && (
                                <X size={16} color="#A0AEC0" style={{ cursor: 'pointer' }} onClick={() => setLoteSearch('')} />
                            )}
                        </Paper>

                        {hasActiveFilters && (
                            <Button
                                startIcon={<X size={16} />}
                                onClick={() => {
                                    setSearchText('');
                                    setLoteSearch('');
                                    setSelectedAlmacen('');
                                }}
                                sx={{ color: '#718096', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: '#FF6600' }, alignSelf: { xs: 'flex-start', sm: 'center' } }}
                            >
                                Limpiar
                            </Button>
                        )}

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />

                        {/* Almacen dropdown */}
                        <Button
                            endIcon={<ChevronDown size={16} />}
                            variant="outlined"
                            onClick={(e) => setAnchorElAlmacen(e.currentTarget)}
                            sx={{
                                backgroundColor: '#FFFFFF',
                                borderColor: selectedAlmacen ? '#FF6600' : '#E0E4E8',
                                color: selectedAlmacen ? '#FF6600' : '#4A5568',
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                '&:hover': { backgroundColor: '#FFF', borderColor: '#FF6600' },
                                alignSelf: { xs: 'flex-start', sm: 'center' }
                            }}
                        >
                            {selectedAlmacen || 'Almacén'}
                        </Button>
                    </Stack>

                    {/* Table */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            p: 1,
                            border: '1px solid #E0E4E8',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {error ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        ) : (
                            <DataGrid
                                rows={filteredRows}
                                columns={columns}
                                loading={isLoading}
                                disableColumnMenu
                                disableRowSelectionOnClick
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
                        )}
                    </Paper>
                </div>
            }
            filters={
                <div className='flex justify-end flex-row'>
                    <Menu
                        anchorEl={anchorElAlmacen}
                        open={Boolean(anchorElAlmacen)}
                        onClose={() => setAnchorElAlmacen(null)}
                        slotProps={{ paper: { sx: { borderRadius: '12px', mt: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E0E4E8' } } }}
                    >
                        <MenuItem onClick={() => { setSelectedAlmacen(''); setAnchorElAlmacen(null); }}>Todos</MenuItem>
                        {uniqueAlmacenes.map(almacen => (
                            <MenuItem key={almacen} onClick={() => { setSelectedAlmacen(almacen); setAnchorElAlmacen(null); }}>{almacen}</MenuItem>
                        ))}
                    </Menu>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showVencido}
                                onChange={(e) => {
                                    setShowVencido(e.target.checked);
                                    // If A_VENC was selected and we hide it, reset the almacen filter
                                    if (!e.target.checked && selectedAlmacen === 'VENCIDO') {
                                        setSelectedAlmacen('');
                                    }
                                }}
                                size="small"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6600' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6600' },
                                }}
                            />
                        }
                        label={
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: showVencido ? '#FF6600' : '#A0AEC0' }}>
                                Vencido
                            </span>
                        }
                        sx={{ mr: 0 }}
                    />


                    {/* Right after the Almacén Button */}
                </div>
            }
            legend={<></>}
        />
    );
}
