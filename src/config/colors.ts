export const brand = {
    orange: '#FF6600',
    orangeSecondary: '#e96c2a',
    orangeHover: '#E65C00',
    navy: '#1a2a5e',
    navyLight: '#2d3f7a',
} as const;

export const accent = {
    primary: '#FF6600',
    shade50: '#FFE0A3',
    shade100: '#FFC876',
    shade200: '#FFB347',
    shade300: '#FF983F',
    shade400: '#E65C00',
} as const;

export const surface = {
    white: '#FFFFFF',
    page: '#F9FAFB',
    muted: '#F8FAFC',
    header: '#f8fafc',
    card: '#FFFFFF',
} as const;

export const slate = {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
} as const;

export const status = {
    error: '#dc2626',
    errorText: '#EF4444',
    errorLight: '#f87171',
    errorLighter: '#fca5a5',
    errorLightest: '#fecaca',
    errorUltraLight: '#fee2e2',
    success: '#16a34a',
    successLight: '#22c55e',
    successLighter: '#4ade80',
    successLightest: '#86efac',
    successUltraLight: '#bbf7d0',
    warning: '#d97706',
    warningLight: '#fde047',
    warningLighter: '#fbbf24',
    info: '#1A56DB',
    infoLight: '#4A90D9',
    infoLighter: '#7FB3E0',
    amber: '#F4A261',
    orangeDeep: '#E76F3B',
    orangeDeeper: '#D4500A',
    orangeDarkest: '#9C3200',
} as const;

export const chart: {
    productColors: string[];
    slopeColors: string[];
    donut: { label: string; value: number; color: string }[];
    clientDonut: { label: string; value: number; color: string }[];
    treemap: string[];
    heatmap: string[];
    topClients: string[];
    yearColors: string[];
    monthColors: string[];
    rankingEfficiency: string[];
    topProducts: string[];
    bottomProducts: string[];
    otherProducts: string[];
    softColors: string[];
    barSeries: string;
    scatter: string;
    lineValor: string;
    lineUnidades: string;
    activeYear: string;
    bluePalette: string[];
    topClientColors: string[];
} = {
    productColors: [
        '#6366f1', '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#14b8a6', '#8b5cf6', '#06b6d4', '#3b82f6', '#f59e0b',
    ],
    slopeColors: [
        '#6366f1', '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#14b8a6', '#8b5cf6', '#06b6d4', '#3b82f6', '#f59e0b',
    ],
    donut: [
        { label: 'MED-034', value: 10.8, color: '#e09a3e' },
        { label: 'MED-094', value: 11.5, color: '#ef4444' },
        { label: 'MED-124', value: 2.14, color: '#f87171' },
        { label: 'MED-022', value: 1.88, color: '#fb923c' },
        { label: 'MED-032', value: 1.68, color: '#c084fc' },
        { label: 'MED-038', value: 3.02, color: '#a78bfa' },
        { label: 'MED-18', value: 1.48, color: '#60a5fa' },
        { label: 'MED-008', value: 1.68, color: '#34d399' },
        { label: 'MED-001', value: 6.01, color: '#4ade80' },
        { label: 'MED-013', value: 9.11, color: '#86efac' },
        { label: 'MED-015', value: 11.4, color: '#6ee7b7' },
        { label: 'Others', value: 11.8, color: '#94a3b8' },
    ],
    clientDonut: [
        { label: 'COBECA', value: 14.58, color: '#3124B5' },
        { label: 'BADAN', value: 8.9, color: '#685DDE' },
        { label: 'FARMATODO', value: 8.54, color: '#8979FF' },
        { label: 'VACUNMED', value: 12.0, color: '#FC5C04' },
        { label: 'HOSPIPHARMA', value: 28.98, color: '#FD8B4C' },
        { label: 'OTROS', value: 27, color: '#FEB993' },
    ],
    treemap: [
        '#0D0A6E', '#2D25D4', '#5650D4', '#8B86E0', '#B8B5EC',
        '#E53E0A', '#E8693A', '#EF9B76', '#F5C9A8',
        '#8C8C8C', '#B0B0B0', '#D0D0D0', '#EBEBEB',
    ],
    heatmap: ['#f1f5f9', '#cce0ff', '#99baf0', '#5b7fcc', '#2d3f7a', '#1a2a5e'],
    topClients: ['#1a2a5e', '#2d3f7a', '#3d5a99', '#5b7fcc', '#7a9de0', '#99baf0', '#b8d3f5', '#cce0ff'],
    yearColors: ['#1a2a5e', '#FF6600', '#16a34a', '#9333ea', '#e11d48', '#0891b2'],
    monthColors: [
        '#0f1b3d', '#1a2a5e', '#243a7a', '#2e4a99', '#3a5fcc', '#4a7ae0',
        '#5a99f0', '#6ab8f5', '#7ac8ff', '#8ad8ff', '#9ae8ff', '#aad8ff',
    ],
    rankingEfficiency: [
        '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0',
        '#fde047', '#fbbf24', '#fb923c', '#f87171', '#fca5a5', '#fecaca', '#fee2e2',
    ],
    topProducts: ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1'],
    bottomProducts: ['#FF6600', '#FF983F', '#FFB347', '#FFC876', '#FFE0A3'],
    otherProducts: ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'],
    softColors: ['#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9', '#F8FAFC'],
    barSeries: '#3d5a99',
    scatter: '#ef4444',
    lineValor: '#1a2a5e',
    lineUnidades: '#e96c2a',
    activeYear: '#e96c2a',
    bluePalette: ['#1a2a5e', '#2e4a99', '#4a7ae0', '#7ac8ff', '#aad8ff'],
    topClientColors: ['#0F172A', '#FF6600', '#334155', '#64748B', '#94A3B8'],
};

export const table = {
    paperBg: '#FFFFFF',
    paperBorder: '#E0E4E8',
    headerBg: '#f8fafc',
    headerText: '#1e293b',
    cellText: '#475569',
    cellBorder: '#F1F5F9',
    footerBorder: '#F1F5F9',
    scrollbarThumb: 'alpha(\'#000\', 0.1)',
    scrollbarThumbLight: 'alpha(\'#000\', 0.05)',
    rowHoverBg: '#F1F5F9',
    selectedRowBg: '#E2E8F0',
} as const;

export const search = {
    bg: '#FFFFFF',
    border: '#E0E4E8',
    focusBorder: '#FF6600',
    focusShadow: 'rgba(255,102,0,0.08)',
    iconColor: '#A0AEC0',
    clearColor: '#A0AEC0',
} as const;

export const axis = {
    line: '#e2e8f0',
    tick: '#e2e8f0',
    grid: '#f1f5f9',
    tickLabel: '#9ca3af',
    label: '#6b7280',
} as const;

export const navigation = {
    sidebarBg: '#FFFFFF',
    topbarBg: '#FFFFFF',
    activeLink: '#FF6600',
    linkText: '#1a2a5e',
    hoverBg: '#F9FAFB',
} as const;

export const toggle = {
    checked: '#FF6600',
    trackChecked: '#FF6600',
    labelActive: '#FF6600',
    labelDefault: '#A0AEC0',
} as const;

export const component = {
    logoBg: '#1a2a5e',
    logoStroke: '#e96c2a',
    logoDot: '#fff',
    scrollbarThumb: '#d1d5e8',
    tooltipBg: '#1e293b',
    tooltipText: '#fff',
    tooltipShadow: 'rgba(0,0,0,0.2)',
    tooltipShadowDark: 'rgba(0,0,0,0.25)',
    tooltipDesc: '#94a3b8',
    kpiShadow: 'rgba(26,42,94,0.08)',
    cardShadow: 'rgba(26,42,94,0.07)',
    paperShadow: 'rgba(0,0,0,0.04)',
    menuShadow: 'rgba(0,0,0,0.1)',
    divider: '#E0E4E8',
    separator: '#E0E4E8',
    noValue: '#A0AEC0',
    errorText: '#EF4444',
    placeholder: '#94a3b8',
    clearButtonText: '#718096',
    clearButtonHover: '#FF6600',
    almacenButtonBorderDefault: '#E0E4E8',
    almacenButtonTextDefault: '#4A5568',
    almacenButtonTextSelected: '#FF6600',
    almacenButtonHoverBg: '#FFF',
    almacenButtonHoverBorder: '#FF6600',
    heatmapDefaultCell: '#f8fafc',
    heatmapEmptyDash: '#cbd5e1',
    heatmapTodayBorder: '#FF6600',
    heatmapDayHeader: '#94a3b8',
    treemapStroke: '#fff',
    treemapText: '#fff',
    treemapValueLabel: 'rgba(255,255,255,0.85)',
    donutArcLabel: '#fff',
    legendLabel: '#475569',
    legendValue: '#1e293b',
    kpiError: '#EF4444',
    kpiLoading: '#94a3b8',
} as const;

export const contrast = {
    light: '#ffffff',
    dark: '#0f172a',
    textDark: '#1e293b',
} as const;

export const custom = {
    headerTextAlt: '#2D3748',
    cellTextAlt: '#4A5568',
    headerBorderAlt: '#F1F3F5',
    cellBorderAlt: '#F1F3F5',
    selectBg: '#F8FAFC',
    selectBorder: '#E2E8F0',
    selectText: '#475569',
    selectHoverBg: '#F1F5F9',
    storedText: '#1e293b',
    searchBoxBg: '#F8FAFC',
    searchBoxBorder: '#E2E8F0',
    strongText: '#1e293b',
} as const;

export const alert = {
    error: { bg: '#FEE2E2', border: '#FECACA', text: '#DC2626' },
    success: { bg: '#DCFCE7', border: '#BBF7D0', text: '#16A34A' },
    warning: { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706' },
    info: { bg: '#DBEAFE', border: '#BFDBFE', text: '#2563EB' },
} as const;

export const badge = {
    expired: { bg: '#FEE2E2', text: '#DC2626' },
    critical: { bg: '#FEE2E2', text: '#EF4444' },
    warning: { bg: '#FEF3C7', text: '#D97706' },
    success: { bg: '#DCFCE7', text: '#16A34A' },
    info: { bg: '#DBEAFE', text: '#1A56DB' },
} as const;

export const cxc = {
    alDia: '#1A56DB',
    porVencer15d: '#4A90D9',
    vencido30d: '#7FB3E0',
    vencido60d: '#F4A261',
    vencido90d: '#E76F3B',
    vencido120d: '#D4500A',
    vencido120dPlus: '#9C3200',
} as const;
