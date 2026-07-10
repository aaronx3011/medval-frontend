import { motion } from 'framer-motion'
import AmountCard from './utils/amountCard'
import ProuctCard from './utils/productCard'
import { useVentasAnuales } from '../hooks/useVentasAnuales'
import { useAnalisisReposicion } from '../hooks/useAnalisisReposicion'
import { useTotalInventario } from '../hooks/useTotalInventario'
import { formatNumber } from '../utils/formatters'
import { component } from '../config/colors'

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
}

export default function KpiRow() {
    // 1. Get current year and previous year dynamically
    const currentYear = new Date().getFullYear(); // 2026
    const lastYear = currentYear - 1;             // 2025

    // Fetch current year sales
    const {
        data: ventasData,
        loading: ventasLoading,
        error: ventasError
    } = useVentasAnuales(currentYear.toString())

    // Fetch LAST year sales for the average
    const {
        data: ventasLastYearData,
        loading: lastYearLoading,
        error: lastYearError
    } = useVentasAnuales(lastYear.toString())

    // Fetch inventory totals from aggregate endpoint
    const {
        data: totalInvData,
        isLoading: invLoading,
        error: invError
    } = useTotalInventario()

    if (ventasLoading || invLoading || lastYearLoading) {
        return <div className="p-4 text-slate-400">Cargando KPIs...</div>
    }

    if (ventasError || invError || lastYearError) {
        return <div className="p-4 text-red-500">Error cargando los datos.</div>
    }

    const ventasTotals = ventasData?.totals;
    const lastYearTotals = ventasLastYearData?.totals;

    const valorTotalInventarioUSD = totalInvData?.Valor_Total_Venta_USD || 0;
    const totalUnidadesInventario = totalInvData?.Total_Unidades_Fisicas || 0;

    // Calculate your monthly average (Last Year Total USD / 12)
    const promedioVentaMensualUSD = lastYearTotals ? (lastYearTotals.Total_USD / 12) : 0;
    const promedioVentaMensualUnidades = lastYearTotals ? Math.round(lastYearTotals.Total_Unidades / 12) : 0;

    const kpiData = [
        {
            type: 'amount',
            label: 'Unidades vendidas durante el año',
            value: ventasTotals ? ventasTotals.Total_USD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0',
            units: ventasTotals ? formatNumber(ventasTotals.Total_Unidades) : '0'
        },
        {
            type: 'amount',
            label: 'Inventario Actual',
            value: valorTotalInventarioUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Valor calculado ($)
            units: formatNumber(totalUnidadesInventario)  // Total de stock (Unidades)
        },
        {
            type: 'amount',
            label: 'Promedio de venta mensual',
            value: promedioVentaMensualUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            units: formatNumber(promedioVentaMensualUnidades)
        },
        {
            type: 'product',
            label: 'Top Product',
            value: 'ALBUMINA HUMANA (OCT) 20% SOL. 50 ML',
            units: '600000'
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {kpiData.map((kpi, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -2, boxShadow: component.kpiShadow }}
                    className="kpi-card bg-white rounded-xl p-4"
                >
                    {kpi.type === 'amount' ? (
                        <AmountCard
                            titlle={kpi.label}
                            value={kpi.value}
                            value2={kpi.units}
                        />
                    ) : (
                        <ProuctCard
                            titlle={kpi.label}
                            value={kpi.value}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    )
}
