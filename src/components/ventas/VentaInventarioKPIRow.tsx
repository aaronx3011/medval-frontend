import { motion } from 'framer-motion'
import AmountCard from '../utils/amountCard'
import { useAnalisisReposicion } from '../../hooks/useAnalisisReposicion'
import ProductCard from '../utils/productCard'

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
}

export default function VentaInventarioKpiRow() {
    const { data, isLoading, error } = useAnalisisReposicion();

    if (isLoading) {
        return <div className="p-4 text-slate-400">Cargando KPIs...</div>
    }

    if (error) {
        return <div className="p-4 text-red-500">Error cargando los datos.</div>
    }

    const allItems = data?.data || [];
    const activeItems = allItems.filter(item => !item.Estado_Stock?.includes('VENCIDO'));

    // 1. Inventario total
    const valorTotalInventarioUSD = activeItems.reduce((acc, item) =>
        acc + (item.Stock_Total * (item.Ultimo_Precio_Venta_USD || 0)), 0);
    const totalUnidadesInventario = activeItems.reduce((acc, item) =>
        acc + item.Stock_Total, 0);

    // 2. Inventario crítico
    const productosCriticos = activeItems.filter(item => item.Estado_Stock?.includes('CRITICO'));
    const cantidadItemsCriticos = productosCriticos.length;
    const totalUnidadesCriticas = productosCriticos.reduce((acc, item) => acc + item.Stock_Total, 0);
    const dineroEnRiesgoUSD = productosCriticos.reduce((acc, item) =>
        acc + (item.Stock_Total * (item.Ultimo_Costo_Compra_USD || 0)), 0);

    // 3. Cobertura promedio
    const sumaMesesCobertura = activeItems.reduce((acc, item) =>
        acc + (item.Meses_De_Inventario_Restante || 0), 0);
    const promedioMeses = activeItems.length > 0 ? (sumaMesesCobertura / activeItems.length) : 0;

    // 4. Stock bajo
    const productosStockBajo = activeItems.filter(item => item.Meses_De_Inventario_Restante <= 1);
    const totalUnidadesStockBajo = productosStockBajo.reduce((acc, item) => acc + item.Stock_Total, 0);
    const valorStockBajoUSD = productosStockBajo.reduce((acc, item) =>
        acc + (item.Stock_Total * (item.Ultimo_Precio_Venta_USD || 0)), 0);

    const kpiData = [
        {
            type: 'amount',
            label: 'Inventario Actual',
            value: `$${valorTotalInventarioUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            units: `${totalUnidadesInventario.toLocaleString('es-ES')}`,
            cardClass: 'bg-white',
        },
        {
            type: 'amount',
            label: `Inventario Crítico (${cantidadItemsCriticos} Prod.)`,
            value: `$${dineroEnRiesgoUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            units: `${totalUnidadesCriticas.toLocaleString('es-ES')}`,
            cardClass: 'bg-white',
        },
        {
            type: 'product',
            label: 'Cobertura Promedio',
            value: `${promedioMeses.toFixed(2)} Meses`,
            units: 'Inventario global',
            cardClass: 'bg-white',
        },
        {
            type: 'amount',
            label: 'Stock Bajo (≤ 1 Mes)',
            value: `$${valorStockBajoUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            units: `${totalUnidadesStockBajo.toLocaleString('es-ES')}`,
            cardClass: 'bg-white',
        },
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
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(26,42,94,0.08)' }}
                    className={`kpi-card rounded-xl p-4 ${kpi.cardClass}`}
                >
                    {kpi.type === 'amount' ? (
                        <AmountCard
                            titlle={kpi.label}
                            value={kpi.value}
                            value2={kpi.units}
                        />
                    ) : (
                        <ProductCard
                            titlle={kpi.label}
                            value={kpi.value}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    )
}
