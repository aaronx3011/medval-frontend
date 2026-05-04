export const inventarioKpiLabel = 'Ventas en unidades y valores'

export const ventasUnidadesTable = [
    { fecha: '17-04', cliente: 'COBECA', unidades: '17.537', montoBS: '64.422.350', montoUSD: '135.626' },
    { fecha: '18-04', cliente: 'BADAN', unidades: '26.236', montoBS: '82.854.250', montoUSD: '174.430' },
    { fecha: '18-04', cliente: 'FARMATODO', unidades: '27.388', montoBS: '86.816.700', montoUSD: '182.772' },
    { fecha: '20-05', cliente: 'VACUNMED', unidades: '37.529', montoBS: '95.865.925', montoUSD: '201.823' },
    { fecha: '26-04', cliente: 'HOSPIPHARMA', unidades: '82.999', montoBS: '127.423.975', montoUSD: '268.261' },
    { fecha: '26-04', cliente: 'ROHI', unidades: '44.788', montoBS: '109.922.600', montoUSD: '231.416' },
    { fecha: '27-04', cliente: 'COLMEDICAL', unidades: '40.676', montoBS: '85.995.900', montoUSD: '181.044' },
    { fecha: '28-04', cliente: 'EMAC', unidades: '24.814', montoBS: '126.328.625', montoUSD: '265.955' },
    { fecha: '29-04', cliente: 'INSOAMINCA', unidades: '23.000', montoBS: '86.856.125', montoUSD: '182.855' },
    { fecha: '29-04', cliente: 'CLINICVE', unidades: '22.714', montoBS: '112.479.525', montoUSD: '236.799' },
]

export const CLIENTES = [
    'COBECA', 'BADAN', 'FARMATODO', 'VACUNMED', 'HOSPIPHARMA',
    'ROHI', 'COLMEDICAL', 'EMAC', 'INSOAMINCA', 'CLINICVE',
]

export const MONTHS_SHORT = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']

// Slope chart: unidades → ventas per client per month pair
export const slopeData = [
    { client: 'COBECA', unidades: 12.345, ventas: 145.678 },
    { client: 'BADAN', unidades: 29.876, ventas: 190.432 },
    { client: 'FARMATODO', unidades: 33.210, ventas: 199.876 },
    { client: 'VACUNMED', unidades: 40.123, ventas: 215.789 },
    { client: 'HOSPIPHARMA', unidades: 75.432, ventas: 280.654 },
    { client: 'ROHI', unidades: 50.987, ventas: 240.123 },
    { client: 'COLMEDICAL', unidades: 38.765, ventas: 190.567 },
    { client: 'EMAC', unidades: 27.654, ventas: 275.432 },
    { client: 'INSOAMINCA', unidades: 21.345, ventas: 195.678 },
    { client: 'CLINICVE', unidades: 25.678, ventas: 245.890 },
]

export const SLOPE_COLORS = [
    '#6366f1', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#14b8a6', '#8b5cf6', '#06b6d4', '#3b82f6', '#f59e0b',
]

// Top 10 productos — grouped bar by month
export const TOP_PRODUCTS = [
    'AMINOFILINA 250MG',
    'ONDASETRON 4MG/2ML',
    'BUPIVACAINA 0.50%',
]

export const topProductosData = [
    { month: 'Enero', p1: 2800, p2: 100, p3: 50 },
    { month: 'Febrero', p1: 200, p2: 150, p3: 80 },
    { month: 'Marzo', p1: 100, p2: 2600, p3: 120 },
    { month: 'Abril', p1: 150, p2: 200, p3: 900 },
    { month: 'Mayo', p1: 80, p2: 180, p3: 400 },
    { month: 'Junio', p1: 600, p2: 300, p3: 200 },
]

// Donut clientes con más compra
export const clientesDonutData = [
    { label: 'COBECA', value: 14.58, color: '#3124B5' },
    { label: 'BADAN', value: 8.9, color: '#685DDE' },
    { label: 'FARMATODO', value: 8.54, color: '#8979FF' },
    { label: 'VACUNMED', value: 12.0, color: '#FC5C04' },
    { label: 'HOSPIPHARMA', value: 28.98, color: '#FD8B4C' },
    { label: 'OTROS', value: 27, color: '#FEB993' }
]

export const clientesBarData = [
    { month: 'Enero', p1: 0, p2: 0, p3: 0 },
    { month: 'Febrero', p1: 0, p2: 0, p3: 0 },
    { month: 'Marzo', p1: 0, p2: 0, p3: 0 },
    { month: 'Abril', p1: 2800, p2: 200, p3: 400 },
    { month: 'Mayo', p1: 200, p2: 150, p3: 200 },
    { month: 'Junio', p1: 300, p2: 400, p3: 100 },
]

// Bottom table
export const menorVentaData = [
    { nombre: 'MED-138', producto: 'ATENOLOL', pa: 'TENELOL', clasificacion: 'BETABLOQUEANTE', precio: '12.79', vencimiento: '31/11/2026', lote: 'ML75158', bultos: 10 },
    { nombre: 'MED-038', producto: 'BROMURO DE IPATROPIO 250MG', pa: 'PLAUTIS', clasificacion: 'BRONCODILATADOR', precio: '10.23', vencimiento: '25/05/2026', lote: 'JH712368', bultos: 12 },
    { nombre: 'MED-162', producto: 'BROMURO DE ROCURONIO', pa: 'ZOCURON', clasificacion: 'REVERSOR', precio: '10.95', vencimiento: '30/12/2026', lote: 'MO7896L', bultos: 20 },
    { nombre: 'MED-138', producto: 'ATENOLOL', pa: 'TENELOL', clasificacion: 'BETABLOQUEANTE', precio: '12.79', vencimiento: '31/11/2026', lote: 'ML75158', bultos: 10 },
    { nombre: 'MED-038', producto: 'BROMURO DE IPATROPIO 250MG', pa: 'PLAUTIS', clasificacion: 'BRONCODILATADOR', precio: '10.23', vencimiento: '25/05/2026', lote: 'JH712368', bultos: 12 },
]

export const MONTHS_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
export const YEARS = ['2025', '2026']
