import { apiClient } from './apiClient';
import type { InventarioDetalle, InventarioDetalleResponse, InventarioItem, InventarioPorProducto, InventarioPorProductoResponse, InventarioPorVencimiento, InventarioPorVencimientoResponse, InventarioResponse, VentasRotacionApiResponse, AnalisisReposicionResponse } from '../types/inventario';

export const inventarioService = {
    getAnalisisReposicion: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/view/aaron_view_AnalisisReposicionInventario?limit=100000');
    },

    getRotacionProductoAnual: async (): Promise<VentasRotacionApiResponse> => {
        return apiClient('/ventas/agrupado-producto-anual-total-mes');
    },

    fetchInventario: async (): Promise<InventarioItem[]> => {
        const json: InventarioResponse = await apiClient('/view/aaron_view_DetalleInventarioAlmacenLoteVencimientoDolarizado?limit=1000000');
        return json.data;
    },

    fetchInventarioDetalle: async (): Promise<InventarioDetalle[]> => {
        const json: InventarioDetalleResponse = await apiClient('/view/aaron_view_InventarioDetalleDolarizado?limit=1000');
        return json.data;
    },

    fetchInventarioPorProducto: async (): Promise<InventarioPorProducto[]> => {
        const json: InventarioPorProductoResponse = await apiClient('/view/aaron_view_InventarioPorProducto?limit=10000');
        return json.data;
    },

    fetchInventarioPorVencimiento: async (): Promise<InventarioPorVencimiento[]> => {
        const json: InventarioPorVencimientoResponse = await apiClient('/view/aaron_view_InventarioPorVencimiento?limit=10000');
        return json.data;
    },

    fetchInventarioCompleto: async (): Promise<InventarioItem[]> => {
        const json: InventarioResponse = await apiClient('/view/aaron_view_DetalleInventarioCompletoDolarizado?limit=1000000');
        return json.data;
    }
};
