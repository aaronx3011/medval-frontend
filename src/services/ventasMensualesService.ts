import { VentasMensualesResponse } from '../types/ventas';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getVentasMensuales = async (): Promise<VentasMensualesResponse> => {
    // We request the endpoint without a specific year to get all historical data
    const response = await fetch(`${API_BASE_URL}/ventas/total-mensual/`);

    if (!response.ok) {
        throw new Error(`Failed to fetch monthly sales: ${response.statusText}`);
    }

    return response.json();
};
