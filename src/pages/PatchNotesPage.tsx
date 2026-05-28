import { motion } from 'framer-motion';
import { usePatchNotes } from '../hooks/usePatchNotes';
import PatchNotesList from '../components/system/PatchNotesList';

export default function PatchNotesPage() {
    const { data: notes, loading, error } = usePatchNotes();

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <h1 className="text-xl sm:text-2xl font-bold text-brand-navy mb-6">Notas de Parche</h1>

            {loading && <p className="text-sm text-slate-500">Cargando...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && !error && <PatchNotesList notes={notes ?? []} />}
        </motion.main>
    );
}
