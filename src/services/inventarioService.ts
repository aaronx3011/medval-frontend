import { InventarioDetalle, InventarioDetalleResponse, InventarioItem, InventarioResponse, VentasRotacionApiResponse, AnalisisReposicionResponse } from '../types/inventario';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const inventarioService = {
    getAnalisisReposicion: async (): Promise<AnalisisReposicionResponse> => {
        const response = await fetch(`${API_BASE_URL}/view/aaron_view_AnalisisReposicionInventario?limit=100000`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener el análisis de reposición de inventario`);
        }

        return await response.json();
    },



    getRotacionProductoAnual: async (): Promise<VentasRotacionApiResponse> => {
        const response = await fetch(`${API_BASE_URL}/ventas/agrupado-producto-anual-total-mes`);

        if (!response.ok) {
            throw new Error('Error al obtener los datos de rotación anual');
        }

        return response.json();
    },



    fetchInventario: async (): Promise<InventarioItem[]> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/view/aaron_view_DetalleInventarioAlmacenLoteVencimientoDolarizado?limit=1000000`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json: InventarioResponse = await response.json();
            return json.data;
        } catch (error) {
            console.error('Error fetching inventario:', error);
            throw error;
        }
    },

    fetchInventarioDetalle: async (): Promise<InventarioDetalle[]> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/view/aaron_view_InventarioDetalleDolarizado?limit=1000`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json: InventarioDetalleResponse = await response.json();
            return json.data;
        } catch (error) {
            console.error('Error fetching inventario detalle:', error);
            throw error;
        }
    }
};

