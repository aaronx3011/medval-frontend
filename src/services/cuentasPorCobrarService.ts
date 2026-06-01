import { apiClient } from './apiClient';
import type { CuentaPorCobrar2, CuentasPorCobrarResponse2, CuentasPorCobrarResponse } from '../types/cuentasPorCobrar';

export const getCuentasPorCobrar = async (): Promise<CuentasPorCobrarResponse> => {
    return apiClient('/view/aaron_view_CuentasPorCobrarDolarizadasCliente?limit=10000');
};

export const fetchCuentasPorCobrar2 = async (): Promise<CuentaPorCobrar2[]> => {
    const json: CuentasPorCobrarResponse2 = await apiClient('/view/aaron_view_CuentasPorCobrarDolarizadas?limit=1000000');
    return json.data;
};
