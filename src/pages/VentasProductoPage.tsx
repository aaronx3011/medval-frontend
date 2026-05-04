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
                label: item.Codigo_Articulo,
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
                label: item.Codigo_Articulo,
                color: COLORS_BOTTOM[i],
            }));
    }, [ventasData]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-6"
        >
            <div className="flex flex-row gap-4 mb-4">
                <div className='flex-[6]'>
                    <VentasPorProducto
                        selectedProduct={selectedProductCode}
                        onSelectProduct={setSelectedProductCode}
                        ventasData={ventasData}
                        isLoadingVentas={isLoadingVentas}
                    />
                </div>
                <div className='flex-[4]'>
                    <VariacionMensualChart codigoArticulo={selectedProductCode} />
                </div>
            </div>

            <div className="flex flex-row gap-4 mb-4">
                <div className='flex-[3]'>
                    <VentasTotalesPorPeriodo
                        data={clientesData || []}
                        isLoading={isLoadingClientes}
                    />
                </div>
                <div className='flex-[3]'>
                    <DistribucionDeVentasChart data={clientesData || []} />
                </div>
                <div className='flex-[4]'>
                    <div className='flex flex-col gap-4 mb-4 h-full'>
                        <div className='flex-1 min-h-0'>
                            <TopProductosMasVendidos data={top5} isLoading={isLoadingVentas} />
                        </div>
                        <div className='flex-1 min-h-0'>
                            <TopProductosMenosVendidos data={bottom5} isLoading={isLoadingVentas} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.main>
    )
}
