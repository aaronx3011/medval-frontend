#!/bin/bash
# Script to call all API endpoints and save results for analysis with specific client and product codes

API_BASE_URL="http://10.8.0.5:3000/api"
OUTPUT_DIR="./api_results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CLIENT_CODE="J075361776"
PRODUCT_CODE="MED-127"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR/$TIMESTAMP"

echo "Starting API data collection at $TIMESTAMP"
echo "Results will be saved to: $OUTPUT_DIR/$TIMESTAMP/"
echo "Using Client Code: $CLIENT_CODE"
echo "Using Product Code: $PRODUCT_CODE"
echo "---"

# Function to call an API endpoint and save the result
call_api() {
    local endpoint="$1"
    local output_file="$2"
    
    echo "Calling: $endpoint"
    curl -s -w "\nHTTP Status: %{http_code}\n" "$API_BASE_URL$endpoint" > "$OUTPUT_DIR/$TIMESTAMP/$output_file.json"
    echo "Saved to: $output_file.json"
    echo "---"
}

# Call all API endpoints
echo "1. Calling CuentasPorCobrarDolarizadasCliente..."
call_api "/view/aaron_view_CuentasPorCobrarDolarizadasCliente?limit=10000" "cuentas_por_cobrar_cliente"

echo "2. Calling CuentasPorCobrarDolarizadas..."
call_api "/view/aaron_view_CuentasPorCobrarDolarizadas?limit=1000000" "cuentas_por_cobrar"

echo "3. Calling AnalisisReposicionInventario..."
call_api "/view/aaron_view_AnalisisReposicionInventario?limit=100000" "analisis_reposicion_inventario"

echo "4. Calling agrupado-producto-anual-total-mes..."
call_api "/ventas/agrupado-producto-anual-total-mes" "agrupado_producto_anual_total_mes"

echo "5. Calling DetalleInventarioAlmacenLoteVencimientoDolarizado..."
call_api "/view/aaron_view_DetalleInventarioAlmacenLoteVencimientoDolarizado?limit=1000000" "detalle_inventario_almacen_lote_vencimiento"

echo "6. Calling InventarioDetalleDolarizado..."
call_api "/view/aaron_view_InventarioDetalleDolarizado?limit=1000" "inventario_detalle_dolarizado"

echo "7. Getting current year for total-anual endpoint..."
CURRENT_YEAR=$(date +%Y)
call_api "/ventas/total-anual/$CURRENT_YEAR" "total_anual_$CURRENT_YEAR"

echo "8. Calling fechas-disponibles..."
call_api "/ventas/fechas-disponibles" "fechas_disponibles"

echo "9. Getting date range for agrupado-producto-mensual (last 12 months)..."
END_YEAR=$(date +%Y)
END_MONTH=$(date +%m)
START_YEAR=$((END_YEAR - 1))
START_MONTH=$END_MONTH
call_api "/ventas/agrupado-producto-mensual?startYear=$START_YEAR&startMonth=$START_MONTH&endYear=$END_YEAR&endMonth=$END_MONTH" "agrupado_producto_mensual_12months"

echo "10. Calling top-clientes-actual..."
call_api "/ventas/top-clientes-actual" "top_clientes_actual"

echo "11. Using specific product code for clientes-por-producto endpoint..."
call_api "/ventas/clientes-por-producto/$PRODUCT_CODE" "clientes_por_producto_$PRODUCT_CODE"

echo "12. Calling agrupado-ventas-por-cliente-anual..."
call_api "/ventas/agrupado-ventas-por-cliente-anual" "agrupado_ventas_por_cliente_anual"

echo "13. Calling clientes..."
call_api "/clientes/" "clientes"

echo "14. Using specific client code for detalle-ventas-por-cliente-mensual endpoint..."
call_api "/ventas/detalle-ventas-por-cliente-mensual/$CLIENT_CODE" "detalle_ventas_cliente_$CLIENT_CODE"

echo "15. Using specific product code for detalle-producto-mensual endpoint..."
call_api "/ventas/detalle-producto-mensual/$PRODUCT_CODE" "detalle_producto_mensual_$PRODUCT_CODE"

echo "16. Calling DetalleVentasDolarizadasProducto..."
call_api "/view/aaron_view_DetalleVentasDolarizadasProducto?limit=100000" "detalle_ventas_dolarizadas_producto"

echo "17. Calling total-mensual..."
call_api "/ventas/total-mensual/" "total_mensual"

echo "18. Using specific client code for producto-por-cliente endpoint..."
call_api "/ventas/producto-por-cliente/$CLIENT_CODE" "producto_por_cliente_$CLIENT_CODE"

echo "19. Getting current month for detalle-ventas-por-mes-por-anio endpoint..."
CURRENT_MONTH=$(date +%m)
call_api "/ventas/detalle-ventas-por-mes-por-anio?year=$CURRENT_YEAR&month=$CURRENT_MONTH" "detalle_ventas_mes_anio_$CURRENT_YEAR-$CURRENT_MONTH"

echo "All API calls completed!"
echo "Results saved to: $OUTPUT_DIR/$TIMESTAMP/"
