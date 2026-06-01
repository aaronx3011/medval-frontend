import { apiClient } from './apiClient';
import type { ProductoMensualResponse } from '../types/ventas';

const requestCache = new Map<string, Promise<ProductoMensualResponse>>();

export const getDetalleProductoMensual = async (codigoArticulo: string): Promise<ProductoMensualResponse> => {
    if (requestCache.has(codigoArticulo)) {
        return requestCache.get(codigoArticulo)!;
    }

    const fetchPromise: Promise<ProductoMensualResponse> = apiClient<ProductoMensualResponse>(`/ventas/detalle-producto-mensual/${codigoArticulo}`)
        .catch((error) => {
            requestCache.delete(codigoArticulo);
            throw error;
        });

    requestCache.set(codigoArticulo, fetchPromise);
    return fetchPromise;
};
