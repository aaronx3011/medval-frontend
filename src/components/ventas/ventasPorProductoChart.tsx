import { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import GraphCard from '../utils/graphCard';
import { useProductoMensual } from '../../hooks/useProductoMensual';
import { brand, axis } from '../../config/colors'

interface VentasPorProductoChartProps {
    product: string;
    period?: string;
    selectedProductName?: string;
}

export default function VentasPorProductoChart({ product, period, selectedProductName }: VentasPorProductoChartProps) {
    const { data: apiResponse, loading, error } = useProductoMensual(product);

    const chartData = useMemo(() => {
        if (!apiResponse?.data || apiResponse.data.length === 0) {
            return { labels: [], usd: [], unidades: [] };
        }

        const sortedData = [...apiResponse.data].sort((a, b) => {
            if (a.Anio === b.Anio) return a.Mes - b.Mes;
            return a.Anio - b.Anio;
        });

        const labels: string[] = [];
        const usd: number[] = [];
        const unidades: number[] = [];

        let accumulatedUsd = 0;
        let accumulatedUnidades = 0;

        sortedData.forEach((item) => {
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
            titlle={selectedProductName || product || "Seleccione un producto"}
            subtitle={period || ''}
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
                                color: brand.navy,
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                            },
                            {
                                data: chartData.unidades,
                                label: 'Unidades',
                                color: brand.orangeSecondary,
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                            },
                        ]}
                        xAxis={[
                            {
                                data: chartData.labels,
                                scaleType: 'point',
                                tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
                            },
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
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
                            '& .MuiChartsAxis-line': { stroke: axis.line },
                            '& .MuiChartsAxis-tick': { stroke: axis.line },
                            '& .MuiChartsGrid-line': { stroke: axis.grid, strokeDasharray: '4 3' },
                        }}
                    />
                )
            }
            legend={
                loading || error || isEmpty ? <></> : (
                    <div className='flex items-center justify-center'>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 inline-block rounded" style={{ background: brand.navy }} />
                                Valor
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 inline-block rounded" style={{ background: brand.orangeSecondary }} />
                                Unidades
                            </span>
                        </div>
                    </div>
                )
            }
        />
    )
}
