import { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import GraphCard from '../utils/graphCard';
import { useProductoMensual } from '../../hooks/useProductoMensual'; // Adjust path if needed

interface VentasPorProductoChartProps {
    product: string;
}

export default function VentasPorProductoChart({ product }: VentasPorProductoChartProps) {
    // Uses the cached service to avoid double fetching
    const { data: apiResponse, loading, error } = useProductoMensual(product);

    // Transform and accumulate data
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
            // Create a short label like "2/25" for Feb 2025
            labels.push(`${item.Mes}/${item.Anio.toString().slice(-2)}`);

            accumulatedUsd += item.Total_USD;
            accumulatedUnidades += item.Total_Unidades;

            usd.push(accumulatedUsd);
            unidades.push(accumulatedUnidades);
        });

        return { labels, usd, unidades };
    }, [apiResponse]);

    const isEmpty = chartData.labels.length === 0;

    return (
        <GraphCard
            titlle={product || "Seleccione un producto"}
            graph={
                loading ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Cargando gráfico...
                    </div>
                ) : error ? (
                    <div className="flex h-full w-full items-center justify-center text-red-400 text-sm">
                        Error cargando datos
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        No hay datos acumulados disponibles.
                    </div>
                ) : (
                    <LineChart
                        series={[
                            {
                                data: chartData.usd,
                                label: 'Valor (USD)',
                                color: '#1a2a5e',
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                            },
                            {
                                data: chartData.unidades,
                                label: 'Unidades',
                                color: '#e96c2a',
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                            },
                        ]}
                        xAxis={[
                            {
                                data: chartData.labels,
                                scaleType: 'point', // 'point' aligns the Line markers directly with the string labels
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                            },
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                                valueFormatter: (v: number) =>
                                    new Intl.NumberFormat('en-US', {
                                        notation: 'compact',
                                        compactDisplay: 'short',
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
                loading || error || isEmpty ? <></> : (
                    <div className='flex items-center justify-center'>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 bg-[#1a2a5e] inline-block rounded" />
                                Valor
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 bg-[#e96c2a] inline-block rounded" />
                                Unidades
                            </span>
                        </div>
                    </div>
                )
            }
        />
    )
}
