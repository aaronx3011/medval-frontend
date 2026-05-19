# API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints used in the MedVal Dashboard application.

## Base URL

```
http://10.8.0.5:3000/api
```

## Authentication

No authentication is currently required for these endpoints.

## Endpoints

### 1. Accounts Receivable (Cuentas Por Cobrar)

#### Get Client-Level Debt Summary
**Endpoint:** `/view/aaron_view_CuentasPorCobrarDolarizadasCliente`
**Method:** GET
**Parameters:**
- `limit` (optional): Number of records to return

**Response Type:** `CuentasPorCobrarResponse`
```typescript
{
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
```

#### Get Invoice-Level Debt Details
**Endpoint:** `/view/aaron_view_CuentasPorCobrarDolarizadas`
**Method:** GET
**Parameters:**
- `limit` (optional): Number of records to return

**Response Type:** `CuentasPorCobrarResponse2`
```typescript
{
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
```

### 2. Inventory (Inventario)

#### Get Inventory Replenishment Analysis
**Endpoint:** `/view/aaron_view_AnalisisReposicionInventario`
**Method:** GET
**Parameters:**
- `limit` (optional): Number of records to return

**Response Type:** `AnalisisReposicionResponse`
```typescript
{
  metadata: any;
  totals: AnalisisReposicionTotals;
  data: AnalisisReposicion[];
}
```

#### Get Annual Product Rotation Data
**Endpoint:** `/ventas/agrupado-producto-anual-total-mes`
**Method:** GET

**Response Type:** `VentasRotacionApiResponse`
```typescript
{
  metadata: any;
  totals: Record<string, number>;
  data: VentasRotacionApiItem[];
}
```

#### Get Detailed Inventory with Lots and Expiry Dates
**Endpoint:** `/view/aaron_view_DetalleInventarioAlmacenLoteVencimientoDolarizado`
**Method:** GET
**Parameters:**
- `limit` (optional): Number of records to return

**Response Type:** `InventarioResponse`
```typescript
{
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
```

#### Get Simplified Inventory Details
**Endpoint:** `/view/aaron_view_InventarioDetalleDolarizado`
**Method:** GET
**Parameters:**
- `limit` (optional): Number of records to return

**Response Type:** `InventarioDetalleResponse`
```typescript
{
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
```

### 3. Sales (Ventas)

#### Get Annual Sales Summary
**Endpoint:** `/ventas/total-anual/{year}`
**Method:** GET
**Parameters:**
- `year` (path): Year to get sales for

**Response Type:** `VentasAnualesResponse`
```typescript
{
  metadata: {
    year: string;
  };
  totals: VentasTotals;
  data: VentasTotals[];
}
```

#### Get Available Date Ranges
**Endpoint:** `/ventas/fechas-disponibles`
**Method:** GET

**Response Type:** `FechasDisponiblesResponse`
```typescript
{
  metadata: Record<string, unknown>;
  data: FechaDisponible[];
}
```

#### Get Grouped Product Sales by Date Range
**Endpoint:** `/ventas/agrupado-producto-mensual`
**Method:** GET
**Parameters:**
- `startYear`: Starting year
- `startMonth`: Starting month
- `endYear`: Ending year
- `endMonth`: Ending month
- `codigoArticulo` (optional): Product code to filter by

**Response Type:** `AgrupadoProductoResponse`
```typescript
{
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
```

#### Get Detailed Product Sales by Date Range
**Endpoint:** `/ventas/detalle-producto-mensual-fechas`
**Method:** GET
**Parameters:**
- `startYear`: Starting year
- `startMonth`: Starting month
- `endYear`: Ending year
- `endMonth`: Ending month
- `producto`: Product code

**Response Type:** `DetalleProductoMensualFechasResponse`
```typescript
{
  metadata: {
    startYear: string;
    startMonth: string;
    endYear: string;
    endMonth: string;
    producto: string;
  };
  totals: Omit<DetalleProductoMensualFechasData, 'Codigo_Articulo'>;
  data: DetalleProductoMensualFechasData[];
}
```

#### Get Top Clients by Sales
**Endpoint:** `/ventas/top-clientes-actual`
**Method:** GET

**Response Type:** `TopClientsResponse`
```typescript
{
  metadata: any;
  totals: {
    Total_USD: number;
  };
  data: ClientSalesData[];
}
```

#### Get Clients by Product
**Endpoint:** `/ventas/clientes-por-producto/{codigoProducto}`
**Method:** GET
**Parameters:**
- `codigoProducto` (path): Product code

**Response Type:** `ClientesPorProductoResponse`
```typescript
{
  metadata: any;
  totals: {
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
  };
  data: ClientePorProducto[];
}
```

#### Get Annual Sales by Client
**Endpoint:** `/ventas/agrupado-ventas-por-cliente-anual`
**Method:** GET

**Response Type:** `VentasAnualClienteResponse`
```typescript
{
  metadata: any;
  totals: {
    Total_USD: number;
  };
  data: VentasAnualCliente[];
}
```

#### Get Monthly Sales Details by Client
**Endpoint:** `/ventas/detalle-ventas-por-cliente-mensual/{codigoCliente}`
**Method:** GET
**Parameters:**
- `codigoCliente` (path): Client code

**Response Type:** `DetalleVentasClienteResponse`
```typescript
{
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
```

#### Get Monthly Sales Details by Product
**Endpoint:** `/ventas/detalle-producto-mensual/{codigoArticulo}`
**Method:** GET
**Parameters:**
- `codigoArticulo` (path): Product code

**Response Type:** `ProductoMensualResponse`
```typescript
{
  metadata: {
    producto: string;
  };
  totals: Omit<ProductoMensualData, 'Codigo_Articulo'>;
  data: ProductoMensualData[];
}
```

#### Get All Product Sales
**Endpoint:** `/view/aaron_view_DetalleVentasDolarizadasProducto`
**Method:** GET
**Parameters:**
- `limit` (optional): Number of records to return

**Response Type:** `VentasProductoResponse`
```typescript
{
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
```

#### Get Monthly Sales Summary
**Endpoint:** `/ventas/total-mensual/`
**Method:** GET

**Response Type:** `VentasMensualesResponse`
```typescript
{
  metadata: {
    year: number | null;
  };
  totals: VentaMensual;
  data: VentaMensual[];
}
```

#### Get Products by Client
**Endpoint:** `/ventas/producto-por-cliente/{codigoCliente}`
**Method:** GET
**Parameters:**
- `codigoCliente` (path): Client code

**Response Type:** `ClientesPorProductoResponse2`
```typescript
{
  metadata: Record<string, unknown>;
  totals: {
    Total_Unidades: number;
    Total_VES: number;
    Total_USD: number;
    Total_Facturas: number;
  };
  data: ClientePorProducto[];
}
```

#### Get Daily Sales by Month and Year
**Endpoint:** `/ventas/detalle-ventas-por-mes-por-anio`
**Method:** GET
**Parameters:**
- `year`: Year
- `month`: Month (1-12)

**Response Type:** `ApiResponse` (inline type in component)
```typescript
{
  data: VentaDetalle[];
}
```

### 4. Clients (Clientes)

#### Get All Clients
**Endpoint:** `/clientes/`
**Method:** GET

**Response Type:** `Cliente[]` or wrapped response depending on API version
```typescript
{
  data: Cliente[];
}
```

## Data Types Reference

### Accounts Receivable Types

#### CuentaPorCobrar
- `Codigo_Cliente`: string - Client code
- `Total_Documentos_Pendientes`: number - Total pending documents
- `Dias_Maximo_Atraso`: number - Maximum days overdue
- `Total_Facturado_USD`: number | null - Total invoiced in USD
- `Deuda_Total_USD`: number | null - Total debt in USD
- `Deuda_Total_VES`: number - Total debt in VES
- `Por_Vencer_Al_Dia_USD`: number - To be paid on time in USD
- `Vencido_1_A_30_Dias_USD`: number - Overdue 1-30 days in USD
- `Vencido_31_A_60_Dias_USD`: number - Overdue 31-60 days in USD
- `Vencido_61_A_90_Dias_USD`: number - Overdue 61-90 days in USD
- `Vencido_Mas_De_90_Dias_USD`: number | null - Overdue more than 90 days in USD

#### CuentaPorCobrar2
- `Numero_Documento`: string - Document number
- `Tipo_Documento`: string - Document type
- `Fecha_Emision`: string - Issue date
- `Fecha_Vencimiento`: string - Due date
- `Codigo_Cliente`: string - Client code
- `Nombre_Cliente`: string - Client name
- `Tipo_Cliente`: string - Client type
- `Monto_Original_VES`: number - Original amount in VES
- `Saldo_Pendiente_VES`: number - Pending balance in VES
- `Tasa_USD_Aplicada`: number | null - Applied USD rate
- `Monto_Original_USD`: number | null - Original amount in USD
- `Saldo_Pendiente_USD`: number | null - Pending balance in USD
- `Dias_Vencidos`: number - Days overdue
- `Vendedor`: string - Salesperson
- `Sucursal`: string | null - Branch

### Inventory Types

#### AnalisisReposicion
- `Codigo_Articulo`: string - Product code
- `Descripcion_Articulo`: string - Product description
- `Stock_Total`: number - Total stock
- `Proximo_Vencimiento`: string - Next expiry date
- `Estado_Stock`: string - Stock status
- `Venta_Promedio_Mensual_Actual`: number - Current monthly average sales
- `Meses_De_Inventario_Restante`: number - Months of inventory remaining
- `Meta_Venta_Mensual_Para_No_Perder`: number - Monthly sales target to not lose
- `Ultimo_Precio_Venta_USD`: number | null - Last sale price in USD
- `Ultimo_Costo_Compra_USD`: number | null - Last purchase cost in USD

#### VentasRotacionApiItem
- `Codigo_Articulo`: string - Product code
- `Anio`: number - Year
- `Enero` to `Diciembre`: number | null - Monthly sales for each month

#### InventarioItem
- `Codigo_Articulo`: string - Product code
- `Nombre_Articulo`: string - Product name
- `Codigo_Almacen`: string - Warehouse code
- `Nombre_Almacen`: string - Warehouse name
- `Unidades`: number - Units
- `Fecha_Vencimiento`: string | null - Expiry date
- `Lote`: string - Lot number
- `Ultimo_Precio_Venta_USD`: number | null - Last sale price in USD
- `Ultimo_Costo_Compra_USD`: number | null - Last purchase cost in USD
- `Total_Ultimo_Precio_Venta_USD`: number | null - Total last sale price in USD
- `Total_Ultimo_Costo_Compra_USD`: number | null - Total last purchase cost in USD

#### InventarioDetalle
- `Codigo_Articulo`: string - Product code
- `Descripcion_Articulo`: string - Product description
- `Stock_Total`: number - Total stock
- `Proximo_Vencimiento`: string | null - Next expiry date
- `Ultimo_Precio_Venta_USD`: number | null - Last sale price in USD
- `Ultimo_Costo_Compra_USD`: number | null - Last purchase cost in USD

### Client Types

#### Cliente
- `Codigo_Cliente`: string - Client code
- `Tipo_Cliente`: string - Client type
- `Nombre_Cliente`: string - Client name

#### DetalleVentasClienteMensual
- `Codigo_Cliente`: string - Client code
- `Nombre_Cliente`: string - Client name
- `Anio`: number - Year
- `Mes`: number - Month
- `Total_Unidades`: number - Total units sold
- `Total_VES`: number - Total in VES
- `Total_USD`: number - Total in USD
- `Total_Facturas`: number - Total invoices

### Sales Types

#### VentasTotals / VentaMensual
- `Anio` or `Mes`: number - Year or month
- `Total_Unidades`: number - Total units sold
- `Total_VES`: number - Total in VES
- `Total_USD`: number - Total in USD
- `Total_Facturas`: number - Total invoices

#### ProductoMensualData / DetalleProductoMensualFechasData
- `Codigo_Articulo`: string - Product code
- `Anio` or `Mes`: number - Year or month
- `Total_Unidades`: number - Total units sold
- `Total_VES`: number - Total in VES
- `Total_USD`: number - Total in USD
- `Total_Facturas`: number - Total invoices

#### VentaProducto
- `Codigo_Articulo`: string - Product code
- `Total_Unidades`: number - Total units sold
- `Total_VES`: number - Total in VES
- `Total_USD`: number - Total in USD
- `Total_Facturas`: number - Total invoices

#### FechaDisponible
- `Anio`: number - Year
- `Mes`: number - Month

#### AgrupadoProductoData
- `Codigo_Articulo`: string - Product code
- `Total_USD`: number - Total in USD
- `Total_Facturas`: number - Total invoices
- `Total_Unidades`: number - Total units sold

#### ClientSalesData
- `Codigo_Cliente`: string - Client code
- `Nombre_Cliente`: string - Client name
- `Total_USD`: number - Total in USD

#### ClientePorProducto
- `Codigo_Articulo`: string - Product code
- `Codigo_Cliente`: string - Client code
- `Total_Unidades`: number - Total units sold
- `Total_VES`: number - Total in VES
- `Total_USD`: number - Total in USD
- `Total_Facturas`: number - Total invoices

#### VentasAnualCliente
- `Codigo_Cliente`: string - Client code
- `Nombre_Cliente`: string - Client name
- `Total_USD`: number - Total in USD

## Error Handling

All API endpoints may return HTTP error codes. The application handles these errors by:
1. Catching exceptions in service functions
2. Setting error states in hooks
3. Displaying user-friendly messages in components

## Rate Limiting

No rate limiting is currently implemented or documented for these endpoints.

## Versioning

The API does not appear to have versioning at this time.
