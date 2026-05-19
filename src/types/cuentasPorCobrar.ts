
export interface CuentaPorCobrar {
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Total_Documentos_Pendientes: number;
    Dias_Maximo_Atraso: number;
    Total_Facturado_USD: number | null;
    Deuda_Total_USD: number | null;
    Deuda_Total_VES: number;
    Por_Vencer_Al_Dia_USD: number;
    Vencido_1_A_30_Dias_USD: number;
    Vencido_31_A_60_Dias_USD: number;
    Vencido_61_A_90_Dias_USD: number;
    Vencido_Mas_De_90_Dias_USD: number | null;
}

export interface CuentasPorCobrarResponse {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: {
        Total_Documentos_Pendientes: number;
        Dias_Maximo_Atraso: number;
        Total_Facturado_USD: number;
        Deuda_Total_USD: number;
        Deuda_Total_VES: number;
        Por_Vencer_Al_Dia_USD: number;
        Vencido_1_A_30_Dias_USD: number;
        Vencido_31_A_60_Dias_USD: number;
        Vencido_61_A_90_Dias_USD: number;
        Vencido_Mas_De_90_Dias_USD: number;
    };
    data: CuentaPorCobrar[];
}



export interface CuentaPorCobrar2 {
    Numero_Documento: string;
    Tipo_Documento: string;
    Fecha_Emision: string;
    Fecha_Vencimiento: string;
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Tipo_Cliente: string;
    Monto_Original_VES: number;
    Saldo_Pendiente_VES: number;
    Tasa_USD_Aplicada: number | null;
    Monto_Original_USD: number | null;
    Saldo_Pendiente_USD: number | null;
    Dias_Vencidos: number;
    Vendedor: string;
    Sucursal: string | null;
}

export interface CuentasPorCobrarResponse2 {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: {
        Monto_Original_VES: number;
        Saldo_Pendiente_VES: number;
        Tasa_USD_Aplicada: number;
        Monto_Original_USD: number;
        Saldo_Pendiente_USD: number;
        Dias_Vencidos: number;
    };
    data: CuentaPorCobrar2[];
}

export type AgingBucket =
    | 'Al día'
    | 'Por vencer (≤15d)'
    | 'Vencido ≤30d'
    | 'Vencido 30–60d'
    | 'Vencido 60–90d'
    | 'Vencido 90–120d'
    | 'Vencido 120d+';
