import { apiClient } from './apiClient';
import type { VentaProducto, VentasProductoResponse } from '../types/ventas';

export const fetchVentasPorProducto = async (): Promise<VentaProducto[]> => {
    const json: VentasProductoResponse = await apiClient('/view/aaron_view_DetalleVentasDolarizadasProducto?limit=100000');
    return json.data;
};
