import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DataGrid } from '@mui/x-data-grid';
import { Box, InputBase, Button, Paper, Stack, Menu, MenuItem, alpha, Switch, FormControlLabel } from '@mui/material';
import { Search, ChevronDown, X } from 'lucide-react';
import { useInventario } from '../../hooks/useInventario';
import { useTotalInventario } from '../../hooks/useTotalInventario';

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
            const matchesVencido = showVencido ? true : row.Codigo_Almacen !== 'A_VENC' && (!row.Fecha_Vencimiento || new Date(row.Fecha_Vencimiento) > new Date());
            return matchesSearch && matchesAlmacen && matchesLote && matchesVencido;
        });
    }, [rows, searchText, selectedAlmacen, loteSearch, showVencido]);

    const hasActiveFilters = selectedAlmacen || loteSearch || searchText;

    const { data: aggregateTotal } = useTotalInventario();

    const totals = useMemo(() => {
        const sumUnidades = filteredRows.reduce((acc, r) => acc + (r.Unidades || 0), 0);
        const sumTotalVenta = filteredRows.reduce((acc, r) => acc + (r.Total_Ultimo_Precio_Venta_USD || 0), 0);
        const sumTotalCosto = filteredRows.reduce((acc, r) => acc + (r.Total_Ultimo_Costo_Compra_USD || 0), 0);

        const nearestExpiry = filteredRows
            .map(r => r.Fecha_Vencimiento)
            .filter(d => d != null)
            .map(d => new Date(d))
            .filter(d => !isNaN(d.getTime()))
            .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

        return { sumUnidades, sumTotalVenta, sumTotalCosto, nearestExpiry };
    }, [filteredRows]);

    const formatExpiry = (date: Date | null) => {
        if (!date) return '—';
        return date.toLocaleDateString('es-VE', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col w-full gap-4"
        >
            {/* Card 1: Table */}
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
                {/* Title */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                    <h3 className="text-sm font-bold text-brand-orange uppercase tracking-wider">
                        Inventario
                    </h3>
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
                    </div>
                </div>

                {/* Filter Bar */}
                <Stack sx={{ px: 2, pb: 2, flexShrink: 0, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>

                    {/* General search */}
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

                    {/* Lote search */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 200 },
                            backgroundColor: '#F9FAFB',
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
                            initialState={{
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
                    )}
                </Paper>
            </Paper>

            {/* Card 2: Totals */}
            {!error && filteredRows.length > 0 && (
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
                                {hasActiveFilters
                                    ? totals.sumUnidades.toLocaleString('en-US')
                                    : (aggregateTotal?.Total_Unidades_Fisicas || 0).toLocaleString('en-US')}
                            </strong>
                        </Box>
                    </Box>

                    <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '1px', height: 28, backgroundColor: '#E0E4E8' }} />

                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'auto' } }}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexDirection: 'row', gap: 4 }}>
                            <span style={{ whiteSpace: 'nowrap' }}>Próx. Venc:</span>
                            <strong style={{ fontSize: '0.95rem', color: totals.nearestExpiry && totals.nearestExpiry <= new Date() ? '#EF4444' : '#2D3748' }}>
                                {formatExpiry(totals.nearestExpiry)}
                            </strong>
                        </Box>
                    </Box>

                    <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '1px', height: 28, backgroundColor: '#E0E4E8' }} />

                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'auto' } }}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexDirection: 'row', gap: 4 }}>
                            <span style={{ whiteSpace: 'nowrap' }}>Total Venta:</span>
                            <strong style={{ fontSize: '0.95rem', color: '#2D3748' }}>
                                ${(hasActiveFilters
                                    ? totals.sumTotalVenta
                                    : (aggregateTotal?.Valor_Total_Venta_USD || 0)
                                ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </strong>
                        </Box>
                    </Box>

                    <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '1px', height: 28, backgroundColor: '#E0E4E8' }} />

                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'auto' } }}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-start' }, flexDirection: 'row', gap: 4 }}>
                            <span style={{ whiteSpace: 'nowrap' }}>Total Costo:</span>
                            <strong style={{ fontSize: '0.95rem', color: '#2D3748' }}>
                                ${(hasActiveFilters
                                    ? totals.sumTotalCosto
                                    : (aggregateTotal?.Valor_Total_Costo_USD || 0)
                                ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </strong>
                        </Box>
                    </Box>
                </Paper>
            )}
        </motion.div>
    );
}
