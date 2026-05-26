import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, alpha } from '@mui/material';
import { useCuentasPorCobrar2 } from '../hooks/useCuentasPorCobrar';
import { AgingBucket } from '../types/cuentasPorCobrar';
import { formatCompact } from '../utils/formatters';

function getBucket(diasVencidos: number): AgingBucket {
    if (diasVencidos <= 0) return 'Al día';
    if (diasVencidos <= 15) return 'Por vencer (≤15d)';
    if (diasVencidos <= 30) return 'Vencido ≤30d';
    if (diasVencidos <= 60) return 'Vencido 30–60d';
    if (diasVencidos <= 90) return 'Vencido 60–90d';
    if (diasVencidos <= 120) return 'Vencido 90–120d';
    return 'Vencido 120d+';
}

const BUCKET_ORDER: AgingBucket[] = [
    'Al día',
    'Por vencer (≤15d)',
    'Vencido ≤30d',
    'Vencido 30–60d',
    'Vencido 60–90d',
    'Vencido 90–120d',
    'Vencido 120d+',
];

const BUCKET_COLORS: Record<AgingBucket, string> = {
    'Al día': '#1A56DB',
    'Por vencer (≤15d)': '#4A90D9',
    'Vencido ≤30d': '#7FB3E0',
    'Vencido 30–60d': '#F4A261',
    'Vencido 60–90d': '#E76F3B',
    'Vencido 90–120d': '#D4500A',
    'Vencido 120d+': '#9C3200',
};

const columns: GridColDef[] = [
    {
        field: 'Nombre_Cliente',
        headerName: 'Cliente',
        flex: 2,
        minWidth: 180,
    },
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
    },
    {
        field: 'Saldo_Pendiente_USD',
        headerName: 'Saldo USD',
        flex: 1,
        minWidth: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        valueFormatter: (value: number | null) =>
            value != null ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—',
    },
    {
        field: 'Dias_Vencidos',
        headerName: 'Días vencidos',
        flex: 0.8,
        minWidth: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params) => {
            const v: number = params.value;
            const color = v <= 0 ? '#16a34a' : v <= 30 ? '#d97706' : '#dc2626';
            return <span style={{ color, fontWeight: 600 }}>{v}</span>;
        },
    },
];

export default function CuentasPorCobrarPage() {
    const { data, isLoading, error } = useCuentasPorCobrar2();
    const [selectedBucket, setSelectedBucket] = useState<AgingBucket | null>(null);

    const pieData = useMemo(() => {
        const totals: Record<AgingBucket, number> = {
            'Al día': 0,
            'Por vencer (≤15d)': 0,
            'Vencido ≤30d': 0,
            'Vencido 30–60d': 0,
            'Vencido 60–90d': 0,
            'Vencido 90–120d': 0,
            'Vencido 120d+': 0,
        };

        data.forEach(item => {
            const bucket = getBucket(item.Dias_Vencidos);
            totals[bucket] += item.Saldo_Pendiente_USD ?? 0;
        });

        return BUCKET_ORDER
            .filter(b => totals[b] > 0)
            .map((b, i) => ({
                id: i,
                value: Math.round(totals[b] * 100) / 100,
                label: b,
                color: BUCKET_COLORS[b],
            }));
    }, [data]);

    const tableRows = useMemo(() => {
        const source = selectedBucket
            ? data.filter(item => getBucket(item.Dias_Vencidos) === selectedBucket)
            : data;
        return source.map((item, i) => ({ id: i, ...item }));
    }, [data, selectedBucket]);

    const totalSaldo = useMemo(() =>
        tableRows.reduce((acc, row) => acc + (row.Saldo_Pendiente_USD ?? 0), 0),
        [tableRows]
    );

    const handlePieClick = (_: unknown, itemData: { dataIndex: number }) => {
        const clickedLabel = pieData[itemData.dataIndex]?.label as AgingBucket;
        setSelectedBucket(prev => prev === clickedLabel ? null : clickedLabel);
    };

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
                className="chart-card mb-4"
            >
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                    <div>
                        <h2 className="uppercase font-display text-xl lg:text-2xl font-bold text-brand-navy text-left">
                            Cuentas por Cobrar
                        </h2>
                        {selectedBucket && (
                            <p className="text-sm text-slate-500 mt-1">
                                Filtrando por:{' '}
                                <span
                                    className="font-semibold cursor-pointer hover:underline"
                                    style={{ color: BUCKET_COLORS[selectedBucket] }}
                                    onClick={() => setSelectedBucket(null)}
                                >
                                    {selectedBucket}
                                </span>
                                {' '}— click para limpiar
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Saldo total</p>
                        <p className="text-xl font-bold text-brand-navy">
                            ${formatCompact(totalSaldo)}
                        </p>
                        <p className="text-xs text-slate-400">{tableRows.length} documentos</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 min-h-[520px]">
                    {/* Left — Pie chart */}
                    <div className="flex flex-col w-full lg:w-[340px] lg:flex-shrink-0 lg:pl-6">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                            Distribución por antigüedad (USD)
                        </p>

                        {isLoading ? (
                            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                                Cargando...
                            </div>
                        ) : error ? (
                            <div className="flex flex-1 items-center justify-center text-sm text-red-500">
                                {error}
                            </div>
                        ) : (
                            <>
                                <PieChart
                                    series={[{
                                        data: pieData,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                                        innerRadius: 55,
                                        paddingAngle: 2,
                                        cornerRadius: 3,
                                        valueFormatter: (item) =>
                                            `$${formatCompact(item.value)}`,
                                    }]}
                                    onItemClick={handlePieClick}
                                    slotProps={{ legend: { hidden: true } }}
                                    sx={{ cursor: 'pointer', alignSelf: 'center' }}
                                />

                                {/* Custom legend */}
                                <div className="flex flex-col gap-1.5 mt-2">
                                    {pieData.map(item => {
                                        const isSelected = selectedBucket === item.label;
                                        return (
                                            <button
                                                key={item.label}
                                                onClick={() => setSelectedBucket(
                                                    prev => prev === item.label as AgingBucket
                                                        ? null
                                                        : item.label as AgingBucket
                                                )}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 8,
                                                    padding: '5px 10px',
                                                    borderRadius: 8,
                                                    border: isSelected
                                                        ? `2px solid ${item.color}`
                                                        : '2px solid transparent',
                                                    backgroundColor: isSelected
                                                        ? `${item.color}18`
                                                        : 'transparent',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{
                                                        width: 10, height: 10, borderRadius: 2,
                                                        backgroundColor: item.color, flexShrink: 0
                                                    }} />
                                                    <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: isSelected ? 700 : 400 }}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 600 }}>
                                                    ${formatCompact(item.value)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right — Table */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            minHeight: 0,
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            p: 1,
                            border: '1px solid #E0E4E8',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <DataGrid
                            rows={tableRows}
                            columns={columns}
                            loading={isLoading}
                            disableColumnMenu
                            disableRowSelectionOnClick
                            density="compact"
                            rowHeight={40}
                            columnHeaderHeight={40}
                            initialState={{
                                pagination: { paginationModel: { page: 0, pageSize: 15 } },
                                sorting: { sortModel: [{ field: 'Dias_Vencidos', sort: 'desc' }] },
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
                    </Paper>
                </div>
            </motion.div>
        </motion.main>
    );
}
