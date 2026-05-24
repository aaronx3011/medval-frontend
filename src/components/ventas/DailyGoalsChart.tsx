import { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import GraphCard from '../utils/graphCard';
import { useDetalleProductoMensualFechas } from '../../hooks/useDetalleProductoMensualFecha';

// Define the props that the parent (VentasUnidadesSection) is passing down
interface DailyGoalsChartProps {
    selectedProduct: string | null;
    fromYear: string;
    fromMonth: string;
    toYear: string;
    toMonth: string;
    period?: string;
}

export default function DailyGoalsChart({
    selectedProduct,
    fromYear,
    fromMonth,
    toYear,
    toMonth,
    period
}: DailyGoalsChartProps) {

    // Fetch the detailed data
    const { data: apiResponse, isLoading, error } = useDetalleProductoMensualFechas(
        fromYear, fromMonth, toYear, toMonth, selectedProduct
    );

    // Transform and map data for the MUI LineChart (Cumulative Sum)
    const chartData = useMemo(() => {
        if (!apiResponse?.data || apiResponse.data.length === 0) {
            return { labels: [], usd: [], unidades: [] };
        }

        // 1. Sort the data chronologically (oldest Anio/Mes to newest Anio/Mes)
        const sortedData = [...apiResponse.data].sort((a, b) => {
            if (a.Anio === b.Anio) return a.Mes - b.Mes;
            return a.Anio - b.Anio;
        });

        const labels: string[] = [];
        const usd: number[] = [];
        const unidades: number[] = [];

        // 2. Calculate the cumulative sum (running total)
        let accumulatedUsd = 0;
        let accumulatedUnidades = 0;

        sortedData.forEach((item) => {
            // Create a short label like "1/26" for Jan 2026
            labels.push(`${item.Mes}/${item.Anio.toString().slice(-2)}`);

            // Add the current month's value to the running total
            accumulatedUsd += item.Total_USD;
            accumulatedUnidades += item.Total_Unidades;

            usd.push(accumulatedUsd);
            unidades.push(accumulatedUnidades);
        });

        return { labels, usd, unidades };
    }, [apiResponse]);

    const productName = apiResponse?.data?.[0]?.Descripcion_Articulo || selectedProduct || '';
    const isEmpty = chartData.labels.length === 0;

    return (
        <GraphCard
            titlle={selectedProduct ? `Acumulado Mensual: ${productName}` : "Venta por producto"}
            subtitle={period}
            graph={
                isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">Cargando gráfico...</div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-sm text-red-500">Error al cargar datos</div>
                ) : isEmpty ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">Seleccione un producto para ver el gráfico</div>
                ) : (
                    <LineChart
                        series={[
                            {
                                data: chartData.usd,
                                label: 'Valor ($)',
                                color: '#1a2a5e',
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                                valueFormatter: (v: number | null) =>
                                    v ? `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(v)}` : '$0'
                            },
                            {
                                data: chartData.unidades,
                                label: 'Unidades',
                                color: '#e96c2a',
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                                valueFormatter: (v: number | null) =>
                                    v ? new Intl.NumberFormat('en-US').format(v) : '0'
                            },
                        ]}
                        xAxis={[
                            {
                                data: chartData.labels,
                                scaleType: 'band',
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                            }
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                                valueFormatter: (v: number) =>
                                    new Intl.NumberFormat('en-US', {
                                        notation: "compact",
                                        compactDisplay: "short",
                                        maximumFractionDigits: 1
                                    }).format(v)
                            },
                        ]}
                        slotProps={{ legend: { hidden: true } }}
                        margin={{ left: 52, right: 12, top: 8, bottom: 28 }}
                        sx={{
                            '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                            '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                            '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                        }}
                    />
                )
            }
            legend={
                isLoading || error || isEmpty ? <></> : (
                    <div className='flex items-center justify-center'>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 bg-[#1a2a5e] inline-block rounded" />
                                Valor Acumulado
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 bg-[#e96c2a] inline-block rounded" />
                                Unidades Acumuladas
                            </span>
                        </div>
                    </div>
                )
            }
        />
    );
}
