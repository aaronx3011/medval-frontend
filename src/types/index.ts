export interface NavItem {
    id: string
    label: string
    icon: string
}

export interface KpiData {
    label: string
    value: string
    units?: string
    accent?: 'orange' | 'navy'
    isTop?: boolean
    topLabel?: string
    topProduct?: string
    type: string
}

export interface Notification {
    date: string
    code: string
    product: string
    status: 'BAJO STOCK' | 'PRÓXIMO A VENCER'
}

export interface VariacionMensual {
    name: string
    value: number
}

export interface ClientSale {
    name: string
    value: number
}

export interface MonthlySale {
    month: string
    y2020: number
    y2021: number
    y2022: number
}
