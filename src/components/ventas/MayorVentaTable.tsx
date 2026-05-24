import TableCard from '../utils/TableCard'

// Updated headers to match API sales data
const HEADERS = ['Artículo', 'Unidades', 'Facturas', 'Total USD']

interface TableRowData {
    Codigo_Articulo: string;
    Descripcion_Articulo: string;
    Total_Unidades: number;
    Total_Facturas: number;
    Total_USD: number | string;
}

interface Props {
    data: TableRowData[];
    period?: string;
}

export default function MayorVentaTable({ data = [], period }: Props) {
    return (
        <TableCard
            title='Top de productos con mayor venta'
            subtitle={period}
            graph={
                <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                    <table className="w-full min-w-[500px] border-collapse">
                        <thead>
                            <tr className="bg-white">
                                {HEADERS.map(h => (
                                    <th key={h} className="py-2 px-2 text-left font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-[10px]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-1.5 px-2 font-semibold text-slate-700 text-[11px] whitespace-nowrap">{row.Descripcion_Articulo} <span className="text-slate-400 text-[10px]">{row.Codigo_Articulo}</span></td>
                                    <td className="py-1.5 px-2 text-slate-500 text-[11px] whitespace-nowrap">{row.Total_Unidades}</td>
                                    <td className="py-1.5 px-2 text-slate-500 text-[11px] whitespace-nowrap">{row.Total_Facturas}</td>
                                    <td className="py-1.5 px-2 font-bold text-slate-900 text-[11px] whitespace-nowrap">
                                        ${Number(row.Total_USD).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            legend={<div />}
        />
    )
}
