export interface Cliente {
    Codigo_Cliente: string;
    Tipo_Cliente: string;
    Nombre_Cliente: string;
}



export interface DetalleVentasClienteMensual {
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Anio: number;
    Mes: number;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface DetalleVentasClienteResponse {
    metadata: any;
    totals: {
        Anio: number;
        Mes: number;
        Total_Unidades: number;
        Total_VES: number;
        Total_USD: number;
        Total_Facturas: number;
    };
    data: DetalleVentasClienteMensual[];
}
