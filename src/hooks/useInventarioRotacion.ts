import { useState, useEffect } from 'react';
import { VentasMesesFrontend } from '../types/inventario';
import { inventarioService } from '../services/inventarioService';

export const useVentasRotacion = () => {
    const [data, setData] = useState<VentasMesesFrontend[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDatos = async () => {
            setIsLoading(true);
            try {
                const response = await inventarioService.getRotacionProductoAnual();

                const formattedData: VentasMesesFrontend[] = response.data.map((item) => {
                    const ene = item.Enero || 0;
                    const feb = item.Febrero || 0;
                    const mar = item.Marzo || 0;
                    const abr = item.Abril || 0;
                    const may = item.Mayo || 0;
                    const jun = item.Junio || 0;
                    const jul = item.Julio || 0;
                    const ago = item.Agosto || 0;
                    const sep = item.Septiembre || 0;
                    const oct = item.Octubre || 0;
                    const nov = item.Noviembre || 0;
                    const dic = item.Diciembre || 0;

                    // Calculamos la suma total de este producto en este año
                    const totalSuma = ene + feb + mar + abr + may + jun + jul + ago + sep + oct + nov + dic;

                    return {
                        id: `${item.Codigo_Articulo}-${item.Anio}`,
                        Codigo_Articulo: item.Codigo_Articulo,
                        Anio: item.Anio,
                        Enero: ene,
                        Febrero: feb,
                        Marzo: mar,
                        Abril: abr,
                        Mayo: may,
                        Junio: jun,
                        Julio: jul,
                        Agosto: ago,
                        Septiembre: sep,
                        Octubre: oct,
                        Noviembre: nov,
                        Diciembre: dic,
                        Total: totalSuma
                    };
                });

                setData(formattedData);
                setError(null);
            } catch (err: any) {
                console.error("Error en useVentasRotacion:", err);
                setError(err.message);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatos();
    }, []);

    return { data, isLoading, error };
};
