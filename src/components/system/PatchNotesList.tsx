import { PatchNote } from '../../types/patchNotes';

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
    'New Feature': { label: 'Nueva Funcionalidad', color: 'bg-green-100 text-green-700 border-green-200' },
    'Bugfix': { label: 'Corrección', color: 'bg-red-100 text-red-700 border-red-200' },
    'Improvement': { label: 'Mejora', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function PatchNotesList({ notes }: { notes: PatchNote[] }) {
    if (notes.length === 0) {
        return <p className="text-sm text-slate-400 text-center py-8">No hay notas de parche</p>;
    }

    return (
        <div className="space-y-4">
            {notes.map(note => {
                const style = CATEGORY_STYLES[note.category] ?? { label: note.category, color: 'bg-slate-100 text-slate-600 border-slate-200' };
                const date = new Date(note.published_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                return (
                    <div key={note.id} className="chart-card">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${style.color}`}>
                                    {style.label}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                                    {note.version}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{date}</span>
                        </div>
                        <h3 className="text-sm font-bold text-brand-navy mb-1">{note.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{note.content}</p>
                    </div>
                );
            })}
        </div>
    );
}
