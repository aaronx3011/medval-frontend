import { Download } from 'lucide-react';
import { GridApi } from '@mui/x-data-grid';

interface Props {
    apiRef: React.MutableRefObject<GridApi>;
    filename: string;
}

export function sanitizeFilename(s: string | undefined | null, replacement: string = '-'): string {
    if (!s) return '';
    if (replacement === '') {
        const cleaned = s.replace(/[^a-zA-Z0-9]/g, '');
        return cleaned.toLowerCase();
    }
    const escaped = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return s
        .replace(/[^a-zA-Z0-9]/g, replacement)
        .replace(new RegExp(`${escaped}+`, 'g'), replacement)
        .replace(new RegExp(`^${escaped}|${escaped}$`, 'g'), '')
        .toLowerCase();
}

export default function DownloadCsvButton({ apiRef, filename }: Props) {
    const handleDownload = () => {
        apiRef.current.exportDataAsCsv({
            fileName: filename,
            getRowsToExport: () => apiRef.current.getAllRowIds(),
        });
    };

    return (
        <button
            onClick={handleDownload}
            title="Descargar CSV"
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-amber-50 transition-colors"
        >
            <Download size={16} />
        </button>
    );
}
