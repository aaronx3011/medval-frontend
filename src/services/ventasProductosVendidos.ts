import { VentaProducto, VentasProductoResponse } from '../types/ventas';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchVentasPorProducto = async (): Promise<VentaProducto[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/view/aaron_view_DetalleVentasDolarizadasProducto?limit=100000`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: VentasProductoResponse = await response.json();
        return json.data;
    } catch (error) {
        console.error("Error fetching ventas por producto:", error);
        throw error;
    }
};
