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

                    const totalSuma = ene + feb + mar + abr + may + jun + jul + ago + sep + oct + nov + dic;

                    const uEne = item.Enero_Unidades || 0;
                    const uFeb = item.Febrero_Unidades || 0;
                    const uMar = item.Marzo_Unidades || 0;
                    const uAbr = item.Abril_Unidades || 0;
                    const uMay = item.Mayo_Unidades || 0;
                    const uJun = item.Junio_Unidades || 0;
                    const uJul = item.Julio_Unidades || 0;
                    const uAgo = item.Agosto_Unidades || 0;
                    const uSep = item.Septiembre_Unidades || 0;
                    const uOct = item.Octubre_Unidades || 0;
                    const uNov = item.Noviembre_Unidades || 0;
                    const uDic = item.Diciembre_Unidades || 0;

                    const totalUnidades = uEne + uFeb + uMar + uAbr + uMay + uJun + uJul + uAgo + uSep + uOct + uNov + uDic;

                    return {
                        id: `${item.Codigo_Articulo}-${item.Anio}`,
                        Codigo_Articulo: item.Codigo_Articulo,
                        Ref_Articulo: item.Ref_Articulo,
                        Descripcion_Articulo: item.Descripcion_Articulo,
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
                        Total: totalSuma,
                        Enero_Unidades: uEne,
                        Febrero_Unidades: uFeb,
                        Marzo_Unidades: uMar,
                        Abril_Unidades: uAbr,
                        Mayo_Unidades: uMay,
                        Junio_Unidades: uJun,
                        Julio_Unidades: uJul,
                        Agosto_Unidades: uAgo,
                        Septiembre_Unidades: uSep,
                        Octubre_Unidades: uOct,
                        Noviembre_Unidades: uNov,
                        Diciembre_Unidades: uDic,
                        Total_Unidades: totalUnidades,
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
