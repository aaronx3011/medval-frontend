import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChevronDown } from 'lucide-react';

// Hooks & Types
import { useClientes } from '../hooks/useClientes';
import { useDetalleVentasCliente } from '../hooks/useDetalleVentasClientes';
import { useVentasAnualClientes } from '../hooks/useVentasAnualClientes'; // <-- Nuevo hook
import { Cliente } from '../types/clientes';

// MUI components for the combobox
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Internal Components
import ClientesConMayorCompraChart from '../components/ventas/ClientesConMayorCompraChart';
import ProductosPorClienteTable from '../components/ventas/ProductoPorClienteTable';
import GraphCardWithFilters from '../components/utils/graphCardWithFilters';

const MONTHS_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function VentasClientesPage() {
    // 1. Fetch de la lista general de clientes para el ComboBox
    const { clientes, isLoading: isLoadingClientes } = useClientes();
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

    // 2. Fetch del historial del cliente seleccionado (Para la gráfica de líneas)
    const { data: historialCliente, isLoading: isLoadingHistorial } = useDetalleVentasCliente(selectedCliente?.Codigo_Cliente);

    // 3. Fetch de las ventas anuales agrupadas (Para las gráficas Top 5 y Bottom 5)
    const { data: ventasAnuales, isLoading: isLoadingAnual } = useVentasAnualClientes();

    // 4. Calcular Top 5 y Bottom 5
    const top5Clientes = useMemo(() => {
        if (!ventasAnuales) return [];
        return [...ventasAnuales]
            .sort((a, b) => b.Total_USD - a.Total_USD)
            .slice(0, 5);
    }, [ventasAnuales]);

    const bottom5Clientes = useMemo(() => {
        if (!ventasAnuales) return [];
        return [...ventasAnuales]
            .sort((a, b) => a.Total_USD - b.Total_USD)
            .slice(0, 5);
    }, [ventasAnuales]);

    // 5. Lógica para obtener los años disponibles del cliente seleccionado
    const availableYears = useMemo(() => {
        if (!historialCliente || historialCliente.length === 0) return [];
        const years = Array.from(new Set(historialCliente.map(d => d.Anio)));
        return years.sort((a, b) => b - a); // Ordenados de más reciente a más antiguo
    }, [historialCliente]);

    const [selectedYear, setSelectedYear] = useState<string>('');

    // Auto-seleccionar el año más reciente cuando cambien los datos
    useEffect(() => {
        if (availableYears.length > 0) {
            setSelectedYear(availableYears[0].toString());
        } else {
            setSelectedYear('');
        }
    }, [availableYears, selectedCliente]);

    // 6. Formatear la data para la LineChart (rellenando meses vacíos con 0)
    const lineChartData = useMemo(() => {
        if (!selectedYear || !historialCliente || historialCliente.length === 0) return [];

        const filteredByYear = historialCliente.filter(d => d.Anio.toString() === selectedYear);

        return MONTHS_LIST.map((monthName, index) => {
            const monthNumber = index + 1;
            const dataForMonth = filteredByYear.find(d => d.Mes === monthNumber);

            return {
                x: monthName.substring(0, 3), // Usamos 'Ene', 'Feb'
                unidades: dataForMonth ? dataForMonth.Total_Unidades : 0,
                usd: dataForMonth ? dataForMonth.Total_USD : 0
            };
        });
    }, [historialCliente, selectedYear]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col overflow-y-auto p-4 lg:p-6 gap-4"
        >

            <div className="min-h-[450px] lg:min-h-[500px]">
                <GraphCardWithFilters
                    title='Evolución de ventas y unidades'
                    filters={
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            {/* --- CLIENT COMBOBOX --- */}
                            <div className="w-full sm:min-w-[250px]">
                                <Autocomplete
                                    options={Array.isArray(clientes) ? clientes : []}
                                    loading={isLoadingClientes}
                                    getOptionLabel={(option) => `${option.Codigo_Cliente} - ${option.Nombre_Cliente}`}
                                    isOptionEqualToValue={(option, value) => option.Codigo_Cliente === value.Codigo_Cliente}
                                    value={selectedCliente}
                                    onChange={(_event, newValue) => {
                                        setSelectedCliente(newValue);
                                    }}
                                    noOptionsText="No se encontraron clientes"
                                    loadingText="Cargando..."
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Buscar cliente..."
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {
                                                    fontSize: '0.75rem',
                                                    borderRadius: '9999px',
                                                    backgroundColor: '#f8fafc',
                                                    height: '32px',
                                                    paddingTop: '2px',
                                                    paddingBottom: '2px'
                                                }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: '#e2e8f0' },
                                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                                    '&.Mui-focused fieldset': { borderColor: '#FF6600' }
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {/* --- YEAR FILTER (Dinamico) --- */}
                            <div className="relative">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    disabled={availableYears.length === 0}
                                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-full pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 font-medium h-8 disabled:opacity-50"
                                >
                                    {availableYears.length === 0 && <option value="">Año</option>}
                                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                    }
                    graph={
                        <div className="w-full min-h-[350opx] flex flex-row">
                            {isLoadingHistorial ? (
                                <div style={{ width: '100%', height: 380 }}>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400">
                                        Cargando datos del cliente...
                                    </div>
                                </div>
                            ) : lineChartData.length > 0 ? (
                                <LineChart
                                    dataset={lineChartData}
                                    xAxis={[{
                                        scaleType: 'point',
                                        dataKey: 'x',
                                        tickLabelStyle: { fill: '#94a3b8', fontSize: 11 },
                                        sx: {
                                            '& .MuiChartsAxis-line': { stroke: 'transparent' },
                                            '& .MuiChartsAxis-tick': { stroke: 'transparent' }
                                        }
                                    }]}
                                    yAxis={[{
                                        valueFormatter: (v) => v.toLocaleString('es-ES'),
                                        tickLabelStyle: { fill: '#94a3b8', fontSize: 11 },
                                        sx: {
                                            '& .MuiChartsAxis-line': { stroke: 'transparent' },
                                            '& .MuiChartsAxis-tick': { stroke: 'transparent' }
                                        }
                                    }]}
                                    series={[
                                        {
                                            dataKey: 'unidades',
                                            color: '#0F172A',
                                            curve: 'monotoneX',
                                            showMark: false,
                                            area: false,
                                        },
                                        {
                                            dataKey: 'usd',
                                            color: '#ff6b00',
                                            curve: 'monotoneX',
                                            showMark: false,
                                            area: false,
                                        },
                                    ]}
                                    slotProps={{ legend: { hidden: true } }}
                                    margin={{ left: 70, right: 20, top: 20, bottom: 30 }}
                                    grid={{ horizontal: true }}
                                    sx={{ '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeWidth: 1.5 } }}
                                    height={350}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400">
                                    Selecciona un cliente para ver su evolución
                                </div>
                            )}
                        </div>
                    }
                    legend={
                        <div className='flex items-center justify-center pt-2'>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <span className="w-5 h-0.5 bg-brand-navy inline-block rounded" />
                                    Numero de unidades
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <span className="w-5 h-0.5 bg-brand-orange inline-block rounded" />
                                    Valor en USD
                                </span>
                            </div>
                        </div>
                    }
                />
            </div>

            {/* --- TARJETAS INFERIORES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
                <div className="min-h-[350px] lg:min-h-[420px]">
                    <ClientesConMayorCompraChart data={top5Clientes} isLoading={isLoadingAnual} />
                </div>
                <div className="min-h-[350px] lg:min-h-[420px]">
                    <ProductosPorClienteTable
                        codigoCliente={selectedCliente?.Codigo_Cliente}
                        nombreCliente={selectedCliente?.Nombre_Cliente}
                    />
                </div>
            </div>
        </motion.main>
    );
}
