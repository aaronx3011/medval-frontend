import { motion } from 'framer-motion'
import AmountCard from './utils/amountCard'
import ProuctCard from './utils/productCard'
import { useVentasAnuales } from '../hooks/useVentasAnuales'
import { useAnalisisReposicion } from '../hooks/useAnalisisReposicion' // <-- Hook actualizado
import { formatNumber } from '../utils/formatters'

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

    // Fetch inventory data con el NUEVO hook
    const {
        data: invData,
        isLoading: invLoading,
        error: invError
    } = useAnalisisReposicion()

    if (ventasLoading || invLoading || lastYearLoading) {
        return <div className="p-4 text-slate-400">Cargando KPIs...</div>
    }

    if (ventasError || invError || lastYearError) {
        return <div className="p-4 text-red-500">Error cargando los datos.</div>
    }

    const ventasTotals = ventasData?.totals;
    const lastYearTotals = ventasLastYearData?.totals;

    // Cálculo del valor total del inventario en USD
    // Multiplicamos el stock de cada artículo por su último precio de venta
    const valorTotalInventarioUSD = invData?.data.reduce((acc, item) => {
        return acc + (item.Stock_Total * (item.Ultimo_Precio_Venta_USD || 0));
    }, 0) || 0;

    // Total de unidades físicas viene directamente de los totales del nuevo endpoint
    const totalUnidadesInventario = invData?.totals?.Stock_Total || 0;

    // Calculate your monthly average (Last Year Total USD / 12)
    const promedioVentaMensualUSD = lastYearTotals ? (lastYearTotals.Total_USD / 12) : 0;
    const promedioVentaMensualUnidades = lastYearTotals ? Math.round(lastYearTotals.Total_Unidades / 12) : 0;

    const kpiData = [
        {
            type: 'amount',
            label: 'Unidades vendidas durante el año',
            value: ventasTotals ? formatNumber(ventasTotals.Total_USD) : '0',
            units: ventasTotals ? formatNumber(ventasTotals.Total_Unidades) : '0'
        },
        {
            type: 'amount',
            label: 'Inventario Actual',
            value: formatNumber(valorTotalInventarioUSD), // Valor calculado ($)
            units: formatNumber(totalUnidadesInventario)  // Total de stock (Unidades)
        },
        {
            type: 'amount',
            label: 'Promedio de venta mensual',
            value: formatNumber(promedioVentaMensualUSD),
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
        <div className="grid grid-cols-4 gap-4 mb-5">
            {kpiData.map((kpi, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(26,42,94,0.08)' }}
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
