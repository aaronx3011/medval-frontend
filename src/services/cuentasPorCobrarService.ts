import { CuentaPorCobrar2, CuentasPorCobrarResponse2, CuentasPorCobrarResponse } from '../types/cuentasPorCobrar';

const API_BASE_URL = import.meta.env.VITE_API_URL;
export const getCuentasPorCobrar = async (): Promise<CuentasPorCobrarResponse> => {
    const response = await fetch(`${API_BASE_URL}/view/aaron_view_CuentasPorCobrarDolarizadasCliente?limit=10000`);

    if (!response.ok) {
        throw new Error('Error al obtener los datos de las cuentas por cobrar');
    }

    return response.json();
};
import { } from '../types/cuentasPorCobrar';


export const fetchCuentasPorCobrar2 = async (): Promise<CuentaPorCobrar2[]> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/view/aaron_view_CuentasPorCobrarDolarizadas?limit=1000000`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: CuentasPorCobrarResponse2 = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching cuentas por cobrar:', error);
        throw error;
    }
};
