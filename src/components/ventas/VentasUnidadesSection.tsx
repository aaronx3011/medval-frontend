import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import DailyGoalsChart from './DailyGoalsChart'

import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { InputBase, Paper, Stack, alpha, Button } from '@mui/material';
import { Search, X, Eye } from 'lucide-react';
import DownloadCsvButton, { sanitizeFilename } from '../utils/DownloadCsvButton';
import { brand, surface, table, search, slate } from '../../config/colors';

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface VentasUnidadesSectionProps {
    fromMonth: string;
    setFromMonth: (val: string) => void;
    fromYear: string;
    setFromYear: (val: string) => void;
    toMonth: string;
    setToMonth: (val: string) => void;
    toYear: string;
    setToYear: (val: string) => void;
    tableData: any[];
    isLoadingTable: boolean;
    fechasDisponibles: any[];
    isLoadingFechas: boolean;
    selectedProduct: string | null;
    setSelectedProduct: (val: string) => void;
    period?: string;
}

export default function VentasUnidadesSection({
    fromMonth, setFromMonth,
    fromYear, setFromYear,
    toMonth, setToMonth,
    toYear, setToYear,
    tableData, isLoadingTable,
    fechasDisponibles, isLoadingFechas,
    selectedProduct, setSelectedProduct,
    period
}: VentasUnidadesSectionProps) {

    const [searchText, setSearchText] = useState('')

    // Select the first product automatically when table data loads
    useEffect(() => {
        if (tableData && tableData.length > 0 && !selectedProduct) {
            setSelectedProduct(tableData[0].Codigo_Articulo);
        }
    }, [tableData, selectedProduct, setSelectedProduct]);

    // ==========================================
    // DROPDOWN FILTER LOGIC
    // ==========================================
    const allAvailableYears = useMemo(() => {
        if (!fechasDisponibles || fechasDisponibles.length === 0) return [];
        return Array.from(new Set(fechasDisponibles.map((f: any) => f.Anio))).sort((a: any, b: any) => b - a);
    }, [fechasDisponibles]);

    const availableFromYears = useMemo(() => {
        if (!toYear) return allAvailableYears;
        return allAvailableYears.filter((y: any) => y <= parseInt(toYear, 10));
    }, [allAvailableYears, toYear]);

    const availableToYears = useMemo(() => {
        if (!fromYear) return allAvailableYears;
        return allAvailableYears.filter((y: any) => y >= parseInt(fromYear, 10));
    }, [allAvailableYears, fromYear]);

    const getBaseMonthsForYear = (yearStr: string) => {
        if (!yearStr || !fechasDisponibles) return [];
        const yearNum = parseInt(yearStr, 10);
        return fechasDisponibles
            .filter((f: any) => f.Anio === yearNum)
            .map((f: any) => f.Mes)
            .sort((a: any, b: any) => a - b);
    };

    const availableFromMonths = useMemo(() => {
        const baseMonths = getBaseMonthsForYear(fromYear);
        if (fromYear === toYear && toMonth) {
            return baseMonths.filter((m: any) => m <= parseInt(toMonth, 10));
        }
        return baseMonths;
    }, [fromYear, toYear, toMonth, fechasDisponibles]);

    const availableToMonths = useMemo(() => {
        const baseMonths = getBaseMonthsForYear(toYear);
        if (fromYear === toYear && fromMonth) {
            return baseMonths.filter((m: any) => m >= parseInt(fromMonth, 10));
        }
        return baseMonths;
    }, [toYear, fromYear, fromMonth, fechasDisponibles]);

    // ==========================================
    // DATAGRID CONFIGURATION
    // ==========================================
    const rows = useMemo(() => {
        if (!tableData) return [];
        return tableData.map((item, index) => ({
            id: index,
            ...item
        }));
    }, [tableData]);

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
                <strong style={{ color: slate[800] }}>
                    ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
            )
        },
        {
            field: 'actions',
            headerName: 'Acción',
            minWidth: 70,
            flex: 0.8,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Button
                    size="small"
                    variant={selectedProduct === params.row.Codigo_Articulo ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedProduct(params.row.Codigo_Articulo)}
                    sx={{
                        minWidth: 'auto',
                        p: '4px',
                        borderRadius: '8px',
                        backgroundColor: selectedProduct === params.row.Codigo_Articulo ? brand.orange : 'transparent',
                        borderColor: selectedProduct === params.row.Codigo_Articulo ? brand.orange : slate[200],
                        color: selectedProduct === params.row.Codigo_Articulo ? surface.white : slate[500],
                        '&:hover': {
                            backgroundColor: selectedProduct === params.row.Codigo_Articulo ? brand.orangeHover : slate[100],
                            borderColor: selectedProduct === params.row.Codigo_Articulo ? brand.orangeHover : slate[300],
                        }
                    }}
                >
                    <Eye size={16} />
                </Button>
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

    const apiRef = useGridApiRef();

    const csvFilename = [
        'ventas-mensuales',
        fromYear && fromMonth ? `${fromYear}-${fromMonth}` : '',
        toYear && toMonth ? `${toYear}-${toMonth}` : '',
        searchText
    ].filter(Boolean).map(s => sanitizeFilename(s)).join('_') || 'ventas-mensuales';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chart-card mb-4"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-baseline gap-3">
                    <h2 className="uppercase font-display text-2xl font-bold text-brand-navy text-left">
                        Ventas por Producto Mensual
                    </h2>
                    {period && (
                        <p className="text-[13px] text-slate-400 font-medium">{period}</p>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <DownloadCsvButton apiRef={apiRef} filename={csvFilename} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Desde:</span>
                    <select
                        value={fromYear}
                        onChange={e => setFromYear(e.target.value)}
                        disabled={isLoadingFechas}
                        className="h-7 px-3 rounded-full border border-slate-200 bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Año</option>
                        {availableFromYears.map((y: any) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                        value={fromMonth}
                        onChange={e => setFromMonth(e.target.value)}
                        disabled={!fromYear || isLoadingFechas}
                        className="h-7 px-3 rounded-full border border-slate-200 bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Mes</option>
                        {availableFromMonths.map((m: any) => <option key={m} value={m}>{MONTH_NAMES[m - 1]}</option>)}
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Hasta:</span>
                    <select
                        value={toYear}
                        onChange={e => setToYear(e.target.value)}
                        disabled={isLoadingFechas}
                        className="h-7 px-3 rounded-full border border-slate-200 bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Año</option>
                        {availableToYears.map((y: any) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                        value={toMonth}
                        onChange={e => setToMonth(e.target.value)}
                        disabled={!toYear || isLoadingFechas}
                        className="h-7 px-3 rounded-full border border-slate-200 bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Mes</option>
                        {availableToMonths.map((m: any) => <option key={m} value={m}>{MONTH_NAMES[m - 1]}</option>)}
                    </select>
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
                                backgroundColor: search.bg,
                                borderRadius: '10px',
                                border: `1px solid ${search.border}`,
                                '&:focus-within': { borderColor: search.focusBorder }
                            }}
                        >
                            <Search size={16} color={search.iconColor} style={{ marginRight: '8px' }} />
                            <InputBase
                                placeholder="Buscar artículo..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                sx={{ fontSize: '0.8rem', flex: 1 }}
                            />
                            {searchText && (
                                <X
                                    size={16}
                                    color={search.clearColor}
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
                            backgroundColor: surface.white,
                            borderRadius: '16px',
                            p: 1,
                            border: `1px solid ${table.paperBorder}`,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <DataGrid
                            apiRef={apiRef}
                            rows={filteredRows}
                            columns={columns}
                            loading={isLoadingTable}
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
                            onRowClick={(params) => setSelectedProduct(params.row.Codigo_Articulo)}
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: table.headerBg,
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: table.headerText,
                                    textTransform: 'uppercase',
                                },
                                '& .MuiDataGrid-cell': {
                                    fontSize: '0.75rem',
                                    color: table.cellText,
                                    borderBottom: `1px solid ${table.cellBorder}`,
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    minHeight: '40px',
                                    height: '40px',
                                    borderTop: `1px solid ${table.footerBorder}`,
                                },
                                '& .MuiTablePagination-root': {
                                    fontSize: '0.7rem',
                                    overflow: 'visible',
                                },
                                '& .MuiDataGrid-row': { cursor: 'pointer' },
                                '& ::-webkit-scrollbar': { width: '6px', height: '6px' },
                                '& ::-webkit-scrollbar-thumb': {
                                    backgroundColor: alpha('#000', 0.1),
                                    borderRadius: '10px'
                                },
                            }}
                        />
                    </Paper>
                </div>

                <div className="h-full min-h-[350px] lg:min-h-0">
                    <DailyGoalsChart
                        selectedProduct={selectedProduct}
                        fromYear={fromYear}
                        fromMonth={fromMonth}
                        toYear={toYear}
                        toMonth={toMonth}
                        period={period}
                    />
                </div>
            </div>
        </motion.div>
    )
}
