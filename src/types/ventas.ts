export interface VentasTotals {
    Anio: number;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface VentasAnualesResponse {
    metadata: {
        year: string;
    };
    totals: VentasTotals;
    data: VentasTotals[];
}


export interface VentaMensual {
    Anio: number;
    Mes: number;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface VentasMensualesResponse {
    metadata: {
        year: number | null;
    };
    totals: VentaMensual;
    data: VentaMensual[];
}


export interface ProductoMensualData {
    Codigo_Articulo: string;
    Anio: number;
    Mes: number;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface ProductoMensualResponse {
    metadata: {
        producto: string;
    };
    // The 'totals' object has the same fields but lacks the 'Codigo_Articulo'
    totals: Omit<ProductoMensualData, 'Codigo_Articulo'>;
    data: ProductoMensualData[];
}


export interface VentaProducto {
    Codigo_Articulo: string;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface VentasProductoResponse {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: {
        Total_Unidades: number;
        Total_VES: number;
        Total_USD: number;
        Total_Facturas: number;
    };
    data: VentaProducto[];
}


export interface FechaDisponible {
    Anio: number;
    Mes: number;
}

export interface FechasDisponiblesResponse {
    metadata: Record<string, unknown>;
    data: FechaDisponible[];
}


export interface AgrupadoProductoData {
    Codigo_Articulo: string;
    Total_USD: number;
    Total_Facturas: number;
    Total_Unidades: number;
}

export interface AgrupadoProductoResponse {
    metadata: {
        startYear: string;
        startMonth: string;
        endYear: string;
        endMonth: string;
    };
    totals: {
        Total_USD: number;
        Total_Facturas: number;
        Total_Unidades: number;
    };
    data: AgrupadoProductoData[];
}



export interface DetalleProductoMensualFechasData {
    Codigo_Articulo: string;
    Anio: number;
    Mes: number;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface DetalleProductoMensualFechasResponse {
    metadata: {
        startYear: string;
        startMonth: string;
        endYear: string;
        endMonth: string;
        producto: string;
    };
    // totals is omitted of 'Codigo_Articulo' because the overall total doesn't belong to a single month
    totals: Omit<DetalleProductoMensualFechasData, 'Codigo_Articulo'>;
    data: DetalleProductoMensualFechasData[];
}


export interface ClientSalesData {
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Total_USD: number;
}

export interface TopClientsResponse {
    metadata: any;
    totals: {
        Total_USD: number;
    };
    data: ClientSalesData[];
}


export interface ClientePorProducto {
    Codigo_Articulo: string;
    Codigo_Cliente: string;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface ClientesPorProductoResponse {
    metadata: any;
    totals: {
        Total_Unidades: number;
        Total_VES: number;
        Total_USD: number;
        Total_Facturas: number;
    };
    data: ClientePorProducto[];
}


export interface VentasAnualCliente {
    Codigo_Cliente: string;
    Nombre_Cliente: string;
    Total_USD: number;
}

export interface VentasAnualClienteResponse {
    metadata: any;
    totals: {
        Total_USD: number;
    };
    data: VentasAnualCliente[];
}


export interface ClientePorProducto2 {
    Codigo_Articulo: string;
    Codigo_Cliente: string;
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
}

export interface ClientesPorProductoResponse2 {
    metadata: Record<string, unknown>;
    totals: {
        Total_Unidades: number;
        Total_VES: number;
        Total_USD: number;
        Total_Facturas: number;
    };
    data: ClientePorProducto[];
}
