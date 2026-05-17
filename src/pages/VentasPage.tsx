import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

// Hooks
import { useFechasDisponibles } from '../hooks/useFechasDisponibles'
import { useAgrupadoProductoMensual } from '../hooks/useAgrupadoProductoMensual'

// Components
import VentasUnidadesSection from '../components/ventas/VentasUnidadesSection'
import MenorVentaTable from '../components/ventas/MenorVentaTable'
import MayorVentaTable from '../components/ventas/MayorVentaTable'
import ArticuloVsVentas from '../components/ventas/ClientesDonut'
import TopProductosMasVendidos from '../components/ventas/TopProductosMasVendidos'
import TopProductosMenosVendidos from '../components/ventas/TopProductosMenosVendidos'

// Complementary colors
const OTHER_COLORS = ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1']

export default function VentasPage() {
    // 1. FILTER & SELECTION STATE
    const [fromMonth, setFromMonth] = useState<string>('')
    const [fromYear, setFromYear] = useState<string>('')
    const [toMonth, setToMonth] = useState<string>('')
    const [toYear, setToYear] = useState<string>('')
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

    // 2. LIFTED HOOKS
    const { data: fechasDisponibles, isLoading: isLoadingFechas } = useFechasDisponibles();
    const { data: tableData, isLoading: isLoadingTable } = useAgrupadoProductoMensual(
        fromYear, fromMonth, toYear, toMonth
    );

    // 3. DEFAULT DATE LOGIC
    useEffect(() => {
        if (fechasDisponibles && fechasDisponibles.length > 0 && !fromYear && !toYear) {
            const latestDate = fechasDisponibles.reduce((max: any, curr: any) => {
                if (curr.Anio > max.Anio) return curr;
                if (curr.Anio === max.Anio && curr.Mes > max.Mes) return curr;
                return max;
            }, fechasDisponibles[0]);

            setToYear(latestDate.Anio.toString());
            setToMonth(latestDate.Mes.toString());
            setFromYear((latestDate.Anio - 1).toString());
            setFromMonth(latestDate.Mes.toString());
        }
    }, [fechasDisponibles, fromYear, toYear]);

    // 4. SORTING, 5+1 LOGIC, & VS DONUT CALCULATION
    const sortedData = useMemo(() => {
        if (!tableData || tableData.length === 0) {
            return { top5Charts: [], bottom5Charts: [], top5Table: [], bottom5Table: [], donutData: [] };
        }

        const sortedDesc = [...tableData].sort((a, b) => Number(b.Total_USD) - Number(a.Total_USD));
        const sortedAsc = [...tableData].sort((a, b) => Number(a.Total_USD) - Number(b.Total_USD));
        const selectedItem = tableData.find(item => item.Codigo_Articulo === selectedProduct);

        // --- ARTICULO VS VENTAS (DONUT CHART) LOGIC ---
        let donutData: any[] = [];
        const totalVentas = tableData.reduce((sum, item) => sum + Number(item.Total_USD), 0);

        if (selectedItem) {
            const selectedValue = Number(selectedItem.Total_USD);
            const othersValue = totalVentas - selectedValue;

            donutData = [
                { id: 0, label: selectedItem.Codigo_Articulo, value: selectedValue, color: '#FF6600' },
                { id: 1, label: 'Otros Productos', value: othersValue, color: '#0F172A' } // Navy for contrast
            ];
        }

        // --- TOP CHART LOGIC (5 + 1) ---
        let topRowsForChart = [];
        const selectedIndexInTop = sortedDesc.findIndex(item => item.Codigo_Articulo === selectedProduct);

        if (selectedIndexInTop !== -1 && selectedIndexInTop < 6) {
            topRowsForChart = sortedDesc.slice(0, 6);
        } else {
            topRowsForChart = sortedDesc.slice(0, 5);
            if (selectedItem) topRowsForChart.push(selectedItem);
        }

        // --- BOTTOM CHART LOGIC (5 + 1) ---
        let bottomRowsForChart = [];
        const selectedIndexInBottom = sortedAsc.findIndex(item => item.Codigo_Articulo === selectedProduct);

        if (selectedIndexInBottom !== -1 && selectedIndexInBottom < 6) {
            bottomRowsForChart = sortedAsc.slice(0, 6);
        } else {
            bottomRowsForChart = sortedAsc.slice(0, 5);
            if (selectedItem) bottomRowsForChart.push(selectedItem);
        }

        // --- COLOR MAPPING FUNCTION ---
        const mapColors = (rows: any[]) => {
            let colorIndex = 0;
            return rows.map((item, i) => {
                const isSelected = item.Codigo_Articulo === selectedProduct;
                const color = isSelected ? '#FF6600' : OTHER_COLORS[colorIndex++];
                return {
                    id: i,
                    label: item.Codigo_Articulo,
                    value: Number(item.Total_USD),
                    color: color
                };
            });
        };

        return {
            top5Charts: mapColors(topRowsForChart),
            bottom5Charts: mapColors(bottomRowsForChart),
            top5Table: sortedDesc.slice(0, 5),
            bottom5Table: sortedAsc.slice(0, 5),
            donutData // New data for the vs chart
        };
    }, [tableData, selectedProduct]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <VentasUnidadesSection
                fromMonth={fromMonth}
                setFromMonth={setFromMonth}
                fromYear={fromYear}
                setFromYear={setFromYear}
                toMonth={toMonth}
                setToMonth={setToMonth}
                toYear={toYear}
                setToYear={setToYear}
                tableData={tableData || []}
                isLoadingTable={isLoadingTable}
                fechasDisponibles={fechasDisponibles || []}
                isLoadingFechas={isLoadingFechas}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="min-h-[300px] lg:min-h-[380px]">
                    <TopProductosMasVendidos data={sortedData.top5Charts} />
                </div>
                <div className="min-h-[300px] lg:min-h-[380px]">
                    <ArticuloVsVentas data={sortedData.donutData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MayorVentaTable data={sortedData.top5Table} />
                <MenorVentaTable data={sortedData.bottom5Table} />
            </div>
        </motion.main>
    )
}
