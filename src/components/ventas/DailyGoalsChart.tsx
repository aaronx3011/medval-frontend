import { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import GraphCard from '../utils/graphCard';
import { useDetalleProductoMensualFechas } from '../../hooks/useDetalleProductoMensualFecha';
import { brand, axis } from '../../config/colors'

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

    const { data: apiResponse, isLoading, error } = useDetalleProductoMensualFechas(
        fromYear, fromMonth, toYear, toMonth, selectedProduct
    );

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
                                color: brand.navy,
                                showMark: false,
                                area: true,
                                curve: 'catmullRom',
                                valueFormatter: (v: number | null) =>
                                    v ? `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)}` : '$0'
                            },
                            {
                                data: chartData.unidades,
                                label: 'Unidades',
                                color: brand.orangeSecondary,
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
                                tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
                            }
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: axis.tickLabel },
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
                            '& .MuiChartsAxis-line': { stroke: axis.line },
                            '& .MuiChartsAxis-tick': { stroke: axis.line },
                            '& .MuiChartsGrid-line': { stroke: axis.grid, strokeDasharray: '4 3' },
                        }}
                    />
                )
            }
            legend={
                isLoading || error || isEmpty ? <></> : (
                    <div className='flex items-center justify-center'>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 inline-block rounded" style={{ background: brand.navy }} />
                                Valor Acumulado
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="w-5 h-0.5 inline-block rounded" style={{ background: brand.orangeSecondary }} />
                                Unidades Acumuladas
                            </span>
                        </div>
                    </div>
                )
            }
        />
    );
}
