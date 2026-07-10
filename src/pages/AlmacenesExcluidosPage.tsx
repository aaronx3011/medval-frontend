import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { inventarioService } from '../services/inventarioService'

interface Almacen {
    Codigo_Almacen: string
    Nombre_Almacen: string
}

export default function AlmacenesExcluidosPage() {
    const [allAlmacenes, setAllAlmacenes] = useState<Almacen[]>([])
    const [excluidos, setExcluidos] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedValue, setSelectedValue] = useState<Almacen | null>(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [allRes, exclRes] = await Promise.all([
                inventarioService.getAlmacenesList(),
                inventarioService.getAlmacenesExcluidos(),
            ])
            setAllAlmacenes(allRes.data)
            setExcluidos(exclRes.data.map(e => e.Codigo_Almacen))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const disponibles = useMemo(() => {
        return allAlmacenes
            .filter(a => !excluidos.includes(a.Codigo_Almacen))
            .sort((a, b) => a.Nombre_Almacen.localeCompare(b.Nombre_Almacen))
    }, [allAlmacenes, excluidos])

    const excludedAlmacenes = useMemo(() => {
        return allAlmacenes
            .filter(a => excluidos.includes(a.Codigo_Almacen))
            .sort((a, b) => a.Nombre_Almacen.localeCompare(b.Nombre_Almacen))
    }, [allAlmacenes, excluidos])

    const handleExcluir = async (codigo: string) => {
        try {
            await inventarioService.addAlmacenExcluido(codigo)
            setExcluidos(prev => [...prev, codigo])
            setSelectedValue(null)
        } catch {
            setError('Error al excluir almacén')
        }
    }

    const handleRestaurar = async (codigo: string) => {
        try {
            await inventarioService.removeAlmacenExcluido(codigo)
            setExcluidos(prev => prev.filter(c => c !== codigo))
        } catch {
            setError('Error al restaurar almacén')
        }
    }

    if (loading) {
        return (
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center"
            >
                <div className="animate-spin w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full" />
            </motion.main>
        )
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
            <h1 className="text-xl sm:text-2xl font-bold text-brand-navy mb-6">Almacenes Excluidos</h1>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 font-semibold hover:underline">Cerrar</button>
                </div>
            )}

            <p className="text-xs text-slate-400 mb-6">
                Los almacenes excluidos no se mostrarán en el treemap de inventario.
            </p>

            <div className="kpi-card mb-6">
                <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-3">Agregar exclusión</h2>
                <Autocomplete
                    options={disponibles}
                    value={selectedValue}
                    onChange={(_event, newValue) => {
                        if (newValue) {
                            handleExcluir(newValue.Codigo_Almacen)
                        }
                    }}
                    getOptionLabel={(option) => `${option.Codigo_Almacen} - ${option.Nombre_Almacen}`}
                    isOptionEqualToValue={(option, value) => option.Codigo_Almacen === value.Codigo_Almacen}
                    noOptionsText="No se encontraron almacenes"
                    size="small"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Buscar almacén para excluir..."
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                style: {
                                    fontSize: '0.75rem',
                                    borderRadius: '12px',
                                    height: '36px',
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#e2e8f0' },
                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                    '&.Mui-focused fieldset': { borderColor: '#FF6600' }
                                }
                            }}
                        />
                    )}
                />
            </div>

            <div className="kpi-card">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider">Excluidos</h2>
                    <span className="text-xs text-slate-400 font-medium">{excludedAlmacenes.length} almacenes</span>
                </div>

                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {excludedAlmacenes.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">No hay almacenes excluidos</p>
                    ) : excludedAlmacenes.map((almacen, i) => (
                        <motion.div
                            key={almacen.Codigo_Almacen}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group"
                        >
                            <div>
                                <span className="text-sm font-medium text-slate-700">{almacen.Nombre_Almacen}</span>
                                <span className="text-xs text-slate-400 ml-2 font-mono">{almacen.Codigo_Almacen}</span>
                            </div>
                            <button
                                onClick={() => handleRestaurar(almacen.Codigo_Almacen)}
                                className="shrink-0 p-1.5 rounded-lg text-red-400 hover:text-green-600 hover:bg-green-50 transition-colors opacity-60 hover:opacity-100"
                                title="Restaurar"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.main>
    )
}
