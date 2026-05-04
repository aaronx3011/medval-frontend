import { DetalleVentasClienteResponse, Cliente } from '../types/clientes';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const clientesService = {
    /**
     * Obtiene la lista completa de clientes.
     */
    getClientes: async (): Promise<Cliente[]> => {
        const response = await fetch(`${API_BASE_URL}/clientes/`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de clientes`);
        }

        return await response.json();
    }
};


export const ventasClientesService = {
    getDetalleMensualCliente: async (codigoCliente: string): Promise<DetalleVentasClienteResponse> => {
        const response = await fetch(`${API_BASE_URL}/ventas/detalle-ventas-por-cliente-mensual/${codigoCliente}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener el detalle del cliente`);
        }

        return await response.json();
    }
};
