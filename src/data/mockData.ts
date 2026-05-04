import type { KpiData, Notification, ClientSale, MonthlySale } from '../types'

export const kpiData: KpiData[] = [
    { label: 'Unidades vendidas durante el año', value: '368.258', accent: 'orange', type: 'amount', units: '650000' },
    { label: 'Inventario Actual', value: '368.258', accent: 'orange', type: 'amount', units: '520000' },
    { label: 'Promedio de venta mensual', value: '368.258', type: 'amount', units: '580000' },
    { label: 'Top Product', value: 'ÁCIDO FOLICO 10MG/2ML', type: 'product', units: '600000' }
]

export const notifications: Notification[] = [
    { date: '17-04', code: 'MED-158', product: 'ÁCIDO FOLICO 10MG/2ML', status: 'BAJO STOCK' },
    { date: '15-04', code: 'MED-040', product: 'ÁCIDO URSODEOXICOLICO', status: 'PRÓXIMO A VENCER' },
    { date: '13-04', code: 'MED-143', product: 'AGUA ESTERIL INYECTABLE', status: 'PRÓXIMO A VENCER' },
    { date: '28-03', code: 'MED-125', product: 'ALBUMINA 50 ML', status: 'BAJO STOCK' },
    { date: '25-03', code: 'MED-084', product: 'AMIKACINA', status: 'BAJO STOCK' },
]

export const clientSales: ClientSale[] = [
    { name: 'ARMA', value: 120 },
    { name: 'FARMATODO', value: 119 },
    { name: 'INSUAMINCA', value: 117 },
    { name: 'ROHI', value: 115 },
    { name: 'RMP', value: 112 },
    { name: 'MÉDICA SP', value: 108 },
    { name: 'EMAC', value: 92 },
    { name: 'VAAMED', value: 78 },
]

export const monthlySales: MonthlySale[] = [
    { month: 'Enero', y2020: 40, y2021: 80, y2022: 28 },
    { month: 'Febrero', y2020: 65, y2021: 42, y2022: 65 },
    { month: 'Marzo', y2020: 20, y2021: 75, y2022: 20 },
]

// Daily line chart data (31 days)
export const dailyChartData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    return {
        day,
        metaMensual: Math.round(15000 + day * 3200 + Math.sin(day * 0.5) * 8000),
        metasDiarias: Math.round(12000 + day * 2800 + Math.cos(day * 0.4) * 10000 + (day * 137) % 5000),
    }
})
