import { apiClient } from './apiClient';
import type { VentasAnualClienteResponse, ClientesPorProductoResponse, TopClientsResponse, DetalleProductoMensualFechasResponse, AgrupadoProductoResponse, VentasAnualesResponse, FechasDisponiblesResponse } from '../types/ventas';

export const getVentasAnuales = async (year: string | number): Promise<VentasAnualesResponse> => {
    return apiClient(`/ventas/total-anual/${year}`);
};

export const getFechasDisponibles = async (): Promise<FechasDisponiblesResponse> => {
    return apiClient('/ventas/fechas-disponibles');
};

export const getAgrupadoProductoMensual = async (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
): Promise<AgrupadoProductoResponse> => {
    return apiClient(`/ventas/agrupado-producto-mensual?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`);
};

export const getChartDataPorProducto = async (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number,
    codigoArticulo: string
) => {
    return apiClient(`/ventas/agrupado-producto-mensual?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}&codigoArticulo=${codigoArticulo}`);
};

export const getDetalleProductoMensualFechas = async (
    startYear: string | number,
    startMonth: string | number,
    endYear: string | number,
    endMonth: string | number,
    producto: string
): Promise<DetalleProductoMensualFechasResponse> => {
    return apiClient(`/ventas/detalle-producto-mensual-fechas?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}&producto=${producto}`);
};

export const getTopClients = async (): Promise<TopClientsResponse> => {
    return apiClient('/ventas/top-clientes-actual');
};

export const ventasService = {
    getClientesPorProducto: async (codigoProducto: string): Promise<ClientesPorProductoResponse> => {
        return apiClient(`/ventas/clientes-por-producto/${codigoProducto}`);
    },

    getVentasAnualClientes: async (): Promise<VentasAnualClienteResponse> => {
        return apiClient('/ventas/agrupado-ventas-por-cliente-anual');
    }
};
