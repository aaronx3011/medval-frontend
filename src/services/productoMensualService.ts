import { ProductoMensualResponse } from '../types/ventas';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Simple cache to prevent duplicate network requests across components
const requestCache = new Map<string, Promise<ProductoMensualResponse>>();

export const getDetalleProductoMensual = async (codigoArticulo: string): Promise<ProductoMensualResponse> => {
    // If a request for this product is already in flight (or completed), return it immediately
    if (requestCache.has(codigoArticulo)) {
        return requestCache.get(codigoArticulo)!;
    }

    const fetchPromise = fetch(`${API_BASE_URL}/ventas/detalle-producto-mensual/${codigoArticulo}`)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch product details: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            // Remove from cache if the request failed so it can be retried later
            requestCache.delete(codigoArticulo);
            throw error;
        });

    // Store the promise in the cache
    requestCache.set(codigoArticulo, fetchPromise);

    return fetchPromise;
};
