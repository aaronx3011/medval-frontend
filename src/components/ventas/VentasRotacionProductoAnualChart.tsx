import { useMemo } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'
import GraphCardWithFilters from '../utils/graphCardWithFilters'
import { VentasMesesFrontend } from '../../types/inventario'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_KEYS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] as const;

// Paleta de azules para los años anteriores (del más oscuro al más claro)
const BLUE_PALETTE = ['#1a2a5e', '#2e4a99', '#4a7ae0', '#7ac8ff', '#aad8ff'];
const ACTIVE_ORANGE = '#e96c2a';

interface VentasRotacionProductoAnualChartProps {
    productHistory: VentasMesesFrontend[];
    activeYear: string;
}

export default function VentasRotacionProductoAnualChart({ productHistory, activeYear }: VentasRotacionProductoAnualChartProps) {

    const isEmpty = !productHistory || productHistory.length === 0;
    const productName = productHistory.length > 0 ? productHistory[0].Codigo_Articulo : '';

    // 1. Mapeamos la data para convertirla en series del LineChart
    const chartData = useMemo(() => {
        if (isEmpty) return { series: [], legendItems: [] };

        // Ordenamos los años para que el año activo quede siempre de primero visualmente (opcional) o por fecha
        const sortedHistory = [...productHistory].sort((a, b) => b.Anio - a.Anio);

        let blueIndex = 0;
        const legendItems: { label: string, color: string }[] = [];

        const series = sortedHistory.map((yearData) => {
            const isSelectedYear = yearData.Anio.toString() === activeYear.toString();

            // Asignamos naranja al año activo, y un azul secuencial a los demás
            let color = '';
            if (isSelectedYear) {
                color = ACTIVE_ORANGE;
            } else {
                color = BLUE_PALETTE[blueIndex % BLUE_PALETTE.length];
                blueIndex++;
            }

            legendItems.push({ label: yearData.Anio.toString(), color });

            return {
                data: MONTH_KEYS.map(m => yearData[m] || 0),
                label: yearData.Anio.toString(),
                color: color,
                showMark: false, // <-- CAMBIO AQUÍ: Oculta los puntos de la línea
                curve: 'catmullRom' as const, // curva suave
                // Hacemos la línea activa un poco más gruesa para que destaque
                strokeWidth: isSelectedYear ? 3 : 2,
            };
        });

        // Ordenamos la leyenda para que el año actual aparezca primero
        legendItems.sort((a, b) => a.label === activeYear ? -1 : b.label === activeYear ? 1 : Number(b.label) - Number(a.label));

        return { series, legendItems };
    }, [productHistory, activeYear, isEmpty]);

    return (
        <GraphCardWithFilters
            title={`Evolución interanual ${productName ? `- ${productName}` : ''}`}
            filters={<div className="h-6"></div>} // Para mantener la alineación de la tarjeta
            graph={
                isEmpty ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                        Selecciona un artículo para ver su evolución histórica
                    </div>
                ) : (
                    <LineChart
                        series={chartData.series}
                        xAxis={[
                            {
                                data: MONTH_NAMES,
                                scaleType: 'point', // Ideal para gráficos de línea
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                            },
                        ]}
                        yAxis={[
                            {
                                tickLabelStyle: { fontSize: 10, fill: '#9ca3af' },
                                valueFormatter: (value) =>
                                    new Intl.NumberFormat('en-US', {
                                        notation: 'compact',
                                        compactDisplay: 'short',
                                        maximumFractionDigits: 1
                                    }).format(value)
                            },
                        ]}
                        slotProps={{ legend: { hidden: true } }}
                        margin={{ left: 52, right: 20, top: 20, bottom: 28 }}
                        sx={{
                            '& .MuiChartsAxis-line': { stroke: '#e2e8f0' },
                            '& .MuiChartsAxis-tick': { stroke: '#e2e8f0' },
                            '& .MuiChartsGrid-line': { stroke: '#f1f5f9', strokeDasharray: '4 3' },
                            // Efecto hover sutil en las líneas
                            '& .MuiLineElement-root': { transition: 'stroke-width 0.2s' },
                        }}
                    />
                )
            }
            legend={
                isEmpty ? (<></>) : (
                    <div className='flex items-center justify-center mt-2'>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                            {chartData.legendItems.map((item) => (
                                <span key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <span
                                        className="w-5 h-1 inline-block rounded"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            }
        />
    )
}
