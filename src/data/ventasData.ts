import { KpiData } from "../types"
import { VariacionMensual } from "../types"
import { chart } from '../config/colors';

export const PRODUCTS = [
    'MED-001', 'MED-002', 'MED-008', 'MED-011', 'MED-012',
    'MED-013', 'MED-014', 'MED-015', 'MED-016', 'MED-021',
]


export const variacionMensual: VariacionMensual[] = [
    { name: 'January', value: 375 },
    { name: 'February', value: 150 },
    { name: 'March', value: 500 },
    { name: 'April', value: 250 },
    { name: 'May', value: 425 },
    { name: 'June', value: 200 },
    { name: 'July', value: 300 },
    { name: 'August', value: 350 },
    { name: 'September', value: 450 },
    { name: 'October', value: 275 },
    { name: 'November', value: 400 },
    { name: 'December', value: 325 }
]

export const kpiData: KpiData[] = [
    { label: 'Inventario Total', value: '$ 368.258', accent: 'orange' },
    { label: 'Stock Critico', value: '$ 68.258', accent: 'orange' },
    { label: 'Stock Bajo', value: '$ 36.258' },
    { label: 'Cobertura Promedio', value: '14 Meses' },
]


export const MONTHS = ['mayo', 'JUNIO', 'JULIO', 'AGOSTO', 'SEP', 'OCT', 'NOV', 'DIC', 'ene-26', 'feb-26', 'mar']

export const rotacionData: Record<string, number[]> = {
    'MED-001': [3000, 1200, 1500, 1100, 900, 800, 1000, 10500, 2100, 2400, 900],
    'MED-002': [3500, 1400, 1700, 1300, 1000, 850, 1100, 10800, 2200, 2500, 950],
    'MED-008': [4000, 1600, 1900, 1500, 1100, 900, 1300, 11000, 2300, 2600, 1000],
    'MED-011': [4500, 1800, 2100, 1700, 1300, 1000, 1500, 11500, 2500, 2700, 1100],
    'MED-012': [5000, 2000, 2300, 1900, 1400, 1100, 1700, 11800, 2700, 2800, 1200],
    'MED-013': [5500, 2200, 2500, 2100, 1500, 1150, 1900, 12000, 2900, 2900, 1300],
    'MED-014': [6000, 2400, 2700, 2300, 1600, 1200, 2000, 12500, 3100, 3000, 1400],
    'MED-015': [6500, 2600, 2900, 2500, 1700, 1300, 2100, 13000, 3300, 3100, 1500],
    'MED-016': [7000, 2800, 3100, 2700, 1800, 1400, 2200, 13500, 3500, 3200, 1600],
    'MED-021': [7500, 3000, 3300, 2900, 1900, 1500, 2300, 14000, 3700, 3300, 1700],
}

export const PRODUCT_COLORS = chart.productColors

export const scatterData = [
    { product: 'MED-001', price: 6, rotation: 180 },
    { product: 'MED-002', price: 8, rotation: 160 },
    { product: 'MED-008', price: 12, rotation: 140 },
    { product: 'MED-011', price: 15, rotation: 130 },
    { product: 'MED-012', price: 18, rotation: 120 },
    { product: 'MED-013', price: 22, rotation: 110 },
    { product: 'MED-014', price: 28, rotation: 95 },
    { product: 'MED-015', price: 32, rotation: 85 },
    { product: 'MED-016', price: 38, rotation: 70 },
    { product: 'MED-021', price: 45, rotation: 55 },
    { product: 'MED-022', price: 20, rotation: 105 },
    { product: 'MED-024', price: 10, rotation: 170 },
    { product: 'MED-027', price: 55, rotation: 40 },
    { product: 'MED-034', price: 4, rotation: 200 },
    { product: 'MED-055', price: 42, rotation: 50 },
    { product: 'VALID-D', price: 35, rotation: 60 },
]

export const donutData = chart.donut.map(d => ({ ...d }))

export const rankingData = [
    { product: 'MED-034', efficiency: 1500 },
    { product: 'MED-094', efficiency: 1200 },
    { product: 'MED-001', efficiency: 950 },
    { product: 'MED-013', efficiency: 750 },
    { product: 'MED-015', efficiency: 580 },
    { product: 'MED-008', efficiency: 420 },
    { product: 'MED-022', efficiency: 310 },
    { product: 'MED-124', efficiency: 240 },
    { product: 'MED-032', efficiency: 180 },
    { product: 'MED-038', efficiency: 130 },
    { product: 'MED-016', efficiency: 90 },
    { product: 'MED-021', efficiency: 60 },
]

export const ventasKpis = [
    { label: 'Rotacion Mensual Promedio', value: '524' },
    { label: 'Mediana de Rotacion', value: '322' },
    { label: 'Productos Alta Rotacion', value: '5' },
    { label: 'Rotacion Anual Total', value: '125.646' },
]
