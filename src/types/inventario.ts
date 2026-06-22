export interface AnalisisReposicion {
    Codigo_Articulo: string;
    Descripcion_Articulo: string;
    Stock_Total: number;
    Proximo_Vencimiento: string;
    Estado_Stock: string;
    Venta_Promedio_Mensual_Actual: number;
    Meses_De_Inventario_Restante: number;
    Meta_Venta_Mensual_Para_No_Perder: number;
    Ultimo_Precio_Venta_USD: number | null;
    Ultimo_Costo_Compra_USD: number | null;
}

export interface AnalisisReposicionTotals {
    Stock_Total: number;
    Venta_Promedio_Mensual_Actual: number;
    Meses_De_Inventario_Restante: number;
    Meta_Venta_Mensual_Para_No_Perder: number;
    Ultimo_Precio_Venta_USD: number;
    Ultimo_Costo_Compra_USD: number;
}

export interface AnalisisReposicionResponse {
    metadata: any;
    totals: AnalisisReposicionTotals;
    data: AnalisisReposicion[];
}


export interface VentasRotacionApiItem {
    Codigo_Articulo: string;
    Descripcion_Articulo: string;
    Anio: number;
    Enero: number | null;
    Febrero: number | null;
    Marzo: number | null;
    Abril: number | null;
    Mayo: number | null;
    Junio: number | null;
    Julio: number | null;
    Agosto: number | null;
    Septiembre: number | null;
    Octubre: number | null;
    Noviembre: number | null;
    Diciembre: number | null;
}

export interface VentasRotacionApiResponse {
    metadata: any;
    totals: Record<string, number>;
    data: VentasRotacionApiItem[];
}

export interface VentasMesesFrontend {
    id: string;
    Codigo_Articulo: string;
    Descripcion_Articulo: string;
    Anio: number; // Lo mantenemos para el filtro interno, aunque no se muestre
    Enero: number;
    Febrero: number;
    Marzo: number;
    Abril: number;
    Mayo: number;
    Junio: number;
    Julio: number;
    Agosto: number;
    Septiembre: number;
    Octubre: number;
    Noviembre: number;
    Diciembre: number;
    Total: number; // NUEVO CAMPO: Suma de todos los meses
}



export interface InventarioItem {
    Codigo_Articulo: string;
    Nombre_Articulo: string;
    Codigo_Almacen: string;
    Nombre_Almacen: string;
    Unidades: number;
    Fecha_Vencimiento: string | null;
    Lote: string;
    Ultimo_Precio_Venta_USD: number | null;
    Ultimo_Costo_Compra_USD: number | null;
    Total_Ultimo_Precio_Venta_USD: number | null;
    Total_Ultimo_Costo_Compra_USD: number | null;
}

export interface InventarioResponse {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: {
        Unidades: number;
        Ultimo_Precio_Venta_USD: number;
        Total_Ultimo_Precio_Venta_USD: number;
        Ultimo_Costo_Compra_USD: number;
        Total_Ultimo_Costo_Compra_USD: number;
    };
    data: InventarioItem[];
}



export interface InventarioTotal {
    Total_Items_Distintos: number;
    Total_Unidades_Fisicas: number;
    Valor_Total_Costo_USD: number;
    Valor_Total_Venta_USD: number;
    Ganancia_Proyectada_USD: number;
}

export interface InventarioTotalResponse {
    metadata: Record<string, never>;
    data: [InventarioTotal];
}

export interface InventarioPorProducto {
    Codigo_Articulo: string;
    Nombre_Articulo: string;
    Almacenes_Distintos: number;
    Total_Unidades: number;
    Total_Valor_Venta_USD: number;
    Total_Valor_Costo_USD: number;
}

export interface InventarioPorProductoResponse {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: Record<string, number>;
    data: InventarioPorProducto[];
}

export interface InventarioPorVencimiento {
    Anio: number;
    Mes: number;
    Productos_Distintos: number;
    Total_Unidades: number;
    Total_Valor_Venta_USD: number;
    Total_Valor_Costo_USD: number;
}

export interface InventarioPorVencimientoResponse {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: Record<string, number>;
    data: InventarioPorVencimiento[];
}

export interface InventarioDetalle {
    Codigo_Articulo: string;
    Descripcion_Articulo: string;
    Stock_Total: number;
    Proximo_Vencimiento: string | null;
    Ultimo_Precio_Venta_USD: number | null;
    Ultimo_Costo_Compra_USD: number | null;
}

export interface InventarioDetalleResponse {
    metadata: {
        view: string;
        page: number;
        limit: number;
        count: number;
    };
    totals: {
        Stock_Total: number;
        Ultimo_Precio_Venta_USD: number;
        Ultimo_Costo_Compra_USD: number;
    };
    data: InventarioDetalle[];
}
