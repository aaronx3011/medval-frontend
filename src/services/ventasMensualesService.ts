import { apiClient } from './apiClient';
import type { VentasMensualesResponse } from '../types/ventas';

export const getVentasMensuales = async (): Promise<VentasMensualesResponse> => {
    return apiClient('/ventas/total-mensual/');
};
