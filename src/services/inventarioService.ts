import { apiClient } from './apiClient';
import type { AnalisisReposicionResponse, InventarioDetalle, InventarioDetalleResponse, InventarioItem, InventarioPorProducto, InventarioPorProductoResponse, InventarioPorVencimiento, InventarioPorVencimientoResponse, InventarioResponse, VentasRotacionApiResponse } from '../types/inventario';

export const inventarioService = {
    getAnalisisReposicion: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/view/aaron_view_AnalisisReposicionInventario?limit=100000');
    },

    getAnalisisCritico: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/view/aaron_view_AnalisisReposicionCritico?limit=10000');
    },

    getAnalisisStockBajo: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/view/aaron_view_AnalisisReposicionStockBajo?limit=10000');
    },

    getAnalisisActivo: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/view/aaron_view_AnalisisReposicionActivo?limit=10000');
    },

    getLotesByProducto: async (codigoArticulo: string): Promise<{ data: any[] }> => {
        return apiClient(`/inventario/lotes/${encodeURIComponent(codigoArticulo)}`);
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
    },

    getAlmacenesList: async (): Promise<{ data: { Codigo_Almacen: string; Nombre_Almacen: string }[] }> => {
        return apiClient('/inventario/almacenes');
    },

    getAlmacenesExcluidos: async (): Promise<{ data: { Codigo_Almacen: string }[] }> => {
        return apiClient('/inventario/almacenes-excluidos');
    },

    addAlmacenExcluido: async (codigoAlmacen: string): Promise<void> => {
        await apiClient('/inventario/almacenes-excluidos', {
            method: 'POST',
            body: JSON.stringify({ codigo_almacen: codigoAlmacen }),
        });
    },

    removeAlmacenExcluido: async (codigoAlmacen: string): Promise<void> => {
        await apiClient(`/inventario/almacenes-excluidos/${encodeURIComponent(codigoAlmacen)}`, {
            method: 'DELETE',
        });
    },
};
