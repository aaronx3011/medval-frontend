import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useClientesPorProducto } from '../hooks/useClientesPorProducto'
import { useVentasProductos } from '../hooks/useVentasProducto'

import VentasPorProducto from '../components/ventas/VentasPorProducto'
import VariacionMensualChart from '../components/ventas/VariacionMensualChart'
import VentasTotalesPorPeriodo from '../components/ventas/VentasTotalesPorPeriodo'
import DistribucionDeVentasChart from '../components/ventas/DistribucionDeVentasChart'
import TopProductosMasVendidos from '../components/ventas/TopProductosVentasMasVendido2'
import TopProductosMenosVendidos from '../components/ventas/TopProductosVentasMenosVendidos2'

const COLORS_TOP = ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1']
const COLORS_BOTTOM = ['#FF6600', '#FF983F', '#FFB347', '#FFC876', '#FFE0A3']

export default function VentasProductoPage() {
    const [selectedProductCode, setSelectedProductCode] = useState<string>('');

    const { data: clientesData, isLoading: isLoadingClientes } = useClientesPorProducto(selectedProductCode);
    const { data: ventasData, isLoading: isLoadingVentas } = useVentasProductos();

    const top5 = useMemo(() => {
        if (!ventasData || ventasData.length === 0) return [];
        return [...ventasData]
            .sort((a, b) => b.Total_USD - a.Total_USD)
            .slice(0, 5)
            .map((item, i) => ({
                id: i,
                value: item.Total_USD,
                label: item.Descripcion_Articulo || item.Codigo_Articulo,
                color: COLORS_TOP[i],
            }));
    }, [ventasData]);

    const bottom5 = useMemo(() => {
        if (!ventasData || ventasData.length === 0) return [];
        return [...ventasData]
            .filter(item => item.Total_USD > 0)
            .sort((a, b) => a.Total_USD - b.Total_USD)
            .slice(0, 5)
            .map((item, i) => ({
                id: i,
                value: item.Total_USD,
                label: item.Descripcion_Articulo || item.Codigo_Articulo,
                color: COLORS_BOTTOM[i],
            }));
    }, [ventasData]);

    const period = 'Histórico';

    const selectedProductName = useMemo(() => {
        if (!selectedProductCode || !ventasData) return '';
        const item = ventasData.find(i => i.Codigo_Articulo === selectedProductCode);
        return item ? (item.Descripcion_Articulo || item.Codigo_Articulo) : '';
    }, [selectedProductCode, ventasData]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                <div className="lg:col-span-3 max-lg:min-h-[400px] lg:h-[560px]">
                    <VentasPorProducto
                        selectedProduct={selectedProductCode}
                        onSelectProduct={setSelectedProductCode}
                        ventasData={ventasData}
                        isLoadingVentas={isLoadingVentas}
                        period={period}
                        selectedProductName={selectedProductName}
                    />
                </div>
                <div className="min-h-[300px] lg:min-h-[380px] lg:col-span-2">
                    <VariacionMensualChart codigoArticulo={selectedProductCode} period={period} selectedProductName={selectedProductName} />
                </div>
            </div>

            {/* Desktop: 3-column grid with two pies stacked in the third column */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                <div className="min-h-[380px]">
                    <VentasTotalesPorPeriodo
                        data={clientesData || []}
                        isLoading={isLoadingClientes}
                        period={period}
                        selectedProductName={selectedProductName}
                    />
                </div>
                <div className="min-h-[380px]">
                    <DistribucionDeVentasChart data={clientesData || []} period={period} selectedProductName={selectedProductName} />
                </div>
                <div className="min-h-[380px]">
                    <div className='flex flex-col gap-4 h-full'>
                        <div className='flex-1'>
                            <TopProductosMasVendidos data={top5} isLoading={isLoadingVentas} />
                        </div>
                        <div className='flex-1'>
                            <TopProductosMenosVendidos data={bottom5} isLoading={isLoadingVentas} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: each pie chart in its own full-width container */}
            <div className="grid grid-cols-1 lg:hidden gap-4 mb-4">
                <div className="min-h-[300px]">
                    <VentasTotalesPorPeriodo
                        data={clientesData || []}
                        isLoading={isLoadingClientes}
                        period={period}
                        selectedProductName={selectedProductName}
                    />
                </div>
                <div className="min-h-[300px]">
                    <DistribucionDeVentasChart data={clientesData || []} period={period} selectedProductName={selectedProductName} />
                </div>
                <div className="min-h-[300px]">
                    <TopProductosMasVendidos data={top5} isLoading={isLoadingVentas} />
                </div>
                <div className="min-h-[300px]">
                    <TopProductosMenosVendidos data={bottom5} isLoading={isLoadingVentas} />
                </div>
            </div>
        </motion.main>
    )
}
