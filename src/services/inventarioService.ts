import { apiClient } from './apiClient';
import type { AnalisisReposicionResponse, InventarioDetalle, InventarioDetalleResponse, InventarioPorProductoResponse, InventarioPorVencimientoResponse, InventarioResponse, VentasRotacionApiResponse } from '../types/inventario';

export const inventarioService = {
    getAnalisisReposicion: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/inventario/analisis-reposicion');
    },

    getAnalisisCritico: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/inventario/analisis-reposicion/critico');
    },

    getAnalisisStockBajo: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/inventario/analisis-reposicion/stock-bajo');
    },

    getAnalisisActivo: async (): Promise<AnalisisReposicionResponse> => {
        return apiClient('/inventario/analisis-reposicion/activo');
    },

    getLotesByProducto: async (codigoArticulo: string): Promise<{ data: any[] }> => {
        return apiClient(`/inventario/lotes/${encodeURIComponent(codigoArticulo)}`);
    },

    getRotacionProductoAnual: async (): Promise<VentasRotacionApiResponse> => {
        return apiClient('/ventas/agrupado-producto-anual-total-mes');
    },

    fetchInventario: async (): Promise<InventarioResponse> => {
        return apiClient('/inventario/reporte');
    },

    fetchInventarioDetalle: async (): Promise<InventarioDetalle[]> => {
        const json: InventarioDetalleResponse = await apiClient('/view/aaron_view_InventarioDetalleDolarizado?limit=1000');
        return json.data;
    },

    fetchInventarioPorProducto: async (): Promise<InventarioPorProductoResponse> => {
        return apiClient('/inventario/por-producto');
    },

    fetchInventarioPorVencimiento: async (): Promise<InventarioPorVencimientoResponse> => {
        return apiClient('/inventario/por-vencimiento');
    },

    fetchInventarioCompleto: async (): Promise<InventarioResponse> => {
        return apiClient('/inventario/completo');
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
