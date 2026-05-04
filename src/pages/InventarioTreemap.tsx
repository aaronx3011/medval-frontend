import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Switch, FormControlLabel } from '@mui/material';
import { useInventarioDetalle } from '../hooks/useInventarioDetalle';
import { useInventario } from '../hooks/useInventario';


type ViewMode = 'units' | 'usd';

// Soft color palette — cycles through these for all prefixes
const SOFT_COLORS = [
    '#0D0A6E', // navy dark
    '#2D25D4', // royal blue
    '#5650D4', // indigo
    '#8B86E0', // lavender mid
    '#B8B5EC', // lavender light
    '#E53E0A', // orange dark
    '#E8693A', // orange mid
    '#EF9B76', // salmon
    '#F5C9A8', // peach
    '#8C8C8C', // gray dark
    '#B0B0B0', // gray mid
    '#D0D0D0', // gray light
    '#EBEBEB', // gray very light
];

// Build a color per unique prefix dynamically
const getPrefixColor = (() => {
    const cache: Record<string, string> = {};
    let index = 0;
    return (prefix: string) => {
        if (!cache[prefix]) {
            cache[prefix] = SOFT_COLORS[index % SOFT_COLORS.length];
            index++;
        }
        return cache[prefix];
    };
})();

// Slightly lighten a hex color for child tiles
function lighten(hex: string, amount = 40): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

interface CustomNodeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    value: number;
    prefix: string;
    viewMode: ViewMode;
    depth: number;
}

function CustomNode(props: CustomNodeProps) {
    const { x, y, width, height, name, value, prefix, viewMode } = props;

    const fill = getPrefixColor(prefix);
    const tooSmall = width < 30 || height < 20;

    const label =
        viewMode === 'units'
            ? `${value.toLocaleString()} u`
            : `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const clipId = `clip-${name.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <g>
            <defs>
                <clipPath id={clipId}>
                    <rect x={x + 4} y={y + 4} width={Math.max(0, width - 8)} height={Math.max(0, height - 8)} />
                </clipPath>
            </defs>

            <rect
                x={x + 1}
                y={y + 1}
                width={width - 2}
                height={height - 2}
                rx={0}
                ry={0}
                fill={fill}
                stroke="#fff"
                strokeWidth={2}
            />

            {!tooSmall && (
                <g clipPath={`url(#${clipId})`}>
                    {/* Code name */}
                    <text
                        x={x + 8}
                        y={y + height / 2 - 7}
                        fill="#fff"
                        fontSize={10}
                        fontWeight={700}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                        {name}
                    </text>
                    {/* Value */}
                    <text
                        x={x + 8}
                        y={y + height / 2 + 7}
                        fill="rgba(255,255,255,0.85)"
                        fontSize={10}
                        fontWeight={500}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                        {label}
                    </text>
                </g>
            )}
        </g>
    );
}

interface TooltipPayloadItem {
    payload: {
        name: string;
        descripcion?: string;
        value: number;
        prefix: string;
    };
}

function CustomTooltip({ active, payload, viewMode }: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    viewMode: ViewMode;
}) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    if (!d.descripcion) return null; // skip group-level tooltip

    return (
        <div style={{
            background: '#1e293b',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '0.78rem',
            maxWidth: 260,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
            <p style={{ fontWeight: 700, marginBottom: 4, color: getPrefixColor(d.prefix) }}>{d.name}</p>
            <p style={{ color: '#94a3b8', marginBottom: 6 }}>{d.descripcion}</p>
            <p style={{ fontWeight: 600 }}>
                {viewMode === 'units'
                    ? `${d.value.toLocaleString()} unidades`
                    : `$${d.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
                }
            </p>
        </div>
    );
}

export default function InventarioTreemap() {
    const { data, isLoading, error } = useInventario();
    const [viewMode, setViewMode] = useState<ViewMode>('units');

    const treeData = useMemo(() => {
        if (!data.length) return [];

        // Group by Nombre_Almacen and sum
        const groups: Record<string, { unidades: number; usd: number }> = {};

        for (const item of data) {
            const almacen = item.Nombre_Almacen || 'SIN ALMACÉN';
            if (!groups[almacen]) {
                groups[almacen] = { unidades: 0, usd: 0 };
            }
            groups[almacen].unidades += item.Unidades ?? 0;
            groups[almacen].usd += item.Unidades * (item.Ultimo_Precio_Venta_USD ?? 0);
        }

        return Object.entries(groups)
            .map(([almacen]) => ({
                name: almacen,
                descripcion: almacen,
                value: viewMode === 'units' ? groups[almacen].unidades : groups[almacen].usd,
                prefix: almacen,
            }))
            .filter(item => item.value > 0);
    }, [data, viewMode]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chart-card mb-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="uppercase font-display text-2xl font-bold text-brand-navy text-left">
                    Inventario
                </h2>

                <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="flex items-center gap-3">
                        {Object.entries(SOFT_COLORS)
                            .filter(([key]) => key !== 'DEFAULT')
                            .map(([prefix, color]) => (
                                <div key={prefix} className="flex items-center gap-1.5">
                                    <div style={{
                                        width: 10, height: 10, borderRadius: 3,
                                        backgroundColor: color, flexShrink: 0
                                    }} />
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                                        {prefix}
                                    </span>
                                </div>
                            ))}
                    </div>

                    {/* Toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={viewMode === 'usd'}
                                onChange={(e) => setViewMode(e.target.checked ? 'usd' : 'units')}
                                size="small"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6600' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6600' },
                                }}
                            />
                        }
                        label={
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: viewMode === 'usd' ? '#FF6600' : '#A0AEC0' }}>
                                USD
                            </span>
                        }
                        sx={{ mr: 0 }}
                    />
                </div>
            </div>

            {/* Chart */}
            <div style={{ width: '100%', height: 560 }}>
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Cargando inventario...
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-sm text-red-500">
                        {error}
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={treeData}
                            dataKey="value"
                            aspectRatio={4 / 3}
                            content={(props: any) => (
                                <CustomNode {...props}
                                    viewMode={viewMode}
                                />
                            )}
                        >
                            <Tooltip
                                content={<CustomTooltip viewMode={viewMode} />}
                            />
                        </Treemap>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
