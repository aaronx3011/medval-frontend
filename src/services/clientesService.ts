import { apiClient } from './apiClient';
import type { DetalleVentasClienteResponse, Cliente } from '../types/clientes';

export const clientesService = {
    getClientes: async (): Promise<Cliente[]> => {
        return apiClient('/clientes/');
    }
};

export const ventasClientesService = {
    getDetalleMensualCliente: async (codigoCliente: string): Promise<DetalleVentasClienteResponse> => {
        return apiClient(`/ventas/detalle-ventas-por-cliente-mensual/${codigoCliente}`);
    }
};
