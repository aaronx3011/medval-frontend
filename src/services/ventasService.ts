import { VentasAnualClienteResponse, ClientesPorProductoResponse, TopClientsResponse, DetalleProductoMensualFechasResponse, AgrupadoProductoResponse, VentasAnualesResponse, FechasDisponiblesResponse } from '../types/ventas';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getVentasAnuales = async (year: string | number): Promise<VentasAnualesResponse> => {
    const response = await fetch(`${API_BASE_URL}/ventas/total-anual/${year}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
};

export const getFechasDisponibles = async (): Promise<FechasDisponiblesResponse> => {
    const response = await fetch(`${API_BASE_URL}/ventas/fechas-disponibles`);

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
};


export const getAgrupadoProductoMensual = async (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
): Promise<AgrupadoProductoResponse> => {
    const response = await fetch(
        `${API_BASE_URL}/ventas/agrupado-producto-mensual?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch grouped data: ${response.statusText}`);
    }

    return response.json();
};

export const getChartDataPorProducto = async (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number,
    codigoArticulo: string
) => {
    const response = await fetch(
        `${API_BASE_URL}/ventas/agrupado-producto-mensual?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}&codigoArticulo=${codigoArticulo}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }

    return response.json();
};




export const getDetalleProductoMensualFechas = async (
    startYear: string | number,
    startMonth: string | number,
    endYear: string | number,
    endMonth: string | number,
    producto: string
): Promise<DetalleProductoMensualFechasResponse> => {
    const response = await fetch(
        `${API_BASE_URL}/ventas/detalle-producto-mensual-fechas?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}&producto=${producto}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch product chart data: ${response.statusText}`);
    }

    return response.json();
};




export const getTopClients = async (): Promise<TopClientsResponse> => {
    const API_URL = `${API_BASE_URL}/ventas/top-clientes-actual`;
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch top clients data');
    }
    return response.json();
};


export const ventasService = {
    getClientesPorProducto: async (codigoProducto: string): Promise<ClientesPorProductoResponse> => {
        const response = await fetch(`${API_BASE_URL}/ventas/clientes-por-producto/${codigoProducto}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la información del producto`);
        }

        return await response.json();
    },


    getVentasAnualClientes: async (): Promise<VentasAnualClienteResponse> => {
        const response = await fetch(`${API_BASE_URL}/ventas/agrupado-ventas-por-cliente-anual`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener el resumen anual`);
        }
        return await response.json();
    }

};


