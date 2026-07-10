export const brand = {
    orange: '#8d6e3e',
    orangeSecondary: '#7b8d43',
    orangeHover: '#725a30',
    navy: '#5e6b36',
} as const;

export const accent = {
    primary: '#8d6e3e',
    shade50: '#ede0cc',
    shade100: '#dcc9ae',
    shade200: '#cbb090',
    shade300: '#ba9772',
    shade400: '#7d5e34',
} as const;

export const surface = {
    white: '#FFFFFF',
    page: '#FFFFFF',
    muted: '#F5F5F0',
    header: '#F5F5F0',
    card: '#FFFFFF',
} as const;

export const slate = {
    50: '#f7f6ed',
    100: '#f0efdf',
    200: '#dddbc8',
    300: '#c5c3ae',
    400: '#a09f98',
    500: '#8a8a80',
    600: '#6f6f66',
    700: '#55554d',
    800: '#3c3c36',
    900: '#262621',
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
    info: '#5e6b36',
    infoLight: '#7b8d43',
    infoLighter: '#9db05e',
    amber: '#C4A265',
    orangeDeep: '#8d6e3e',
    orangeDeeper: '#725a30',
    orangeDarkest: '#4d3d20',
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
        { label: 'MED-034', value: 10.8, color: '#8d6e3e' },
        { label: 'MED-094', value: 11.5, color: '#ef4444' },
        { label: 'MED-124', value: 2.14, color: '#f87171' },
        { label: 'MED-022', value: 1.88, color: '#fb923c' },
        { label: 'MED-032', value: 1.68, color: '#c084fc' },
        { label: 'MED-038', value: 3.02, color: '#a78bfa' },
        { label: 'MED-18', value: 1.48, color: '#7b8d43' },
        { label: 'MED-008', value: 1.68, color: '#9db05e' },
        { label: 'MED-001', value: 6.01, color: '#4ade80' },
        { label: 'MED-013', value: 9.11, color: '#86efac' },
        { label: 'MED-015', value: 11.4, color: '#6ee7b7' },
        { label: 'Others', value: 11.8, color: '#94a3b8' },
    ],
    clientDonut: [
        { label: 'COBECA', value: 14.58, color: '#5e6b36' },
        { label: 'BADAN', value: 8.9, color: '#7b8d43' },
        { label: 'FARMATODO', value: 8.54, color: '#9db05e' },
        { label: 'VACUNMED', value: 12.0, color: '#8d6e3e' },
        { label: 'HOSPIPHARMA', value: 28.98, color: '#ba9772' },
        { label: 'OTROS', value: 27, color: '#dcc9ae' },
    ],
    treemap: [
        '#2d3d1a', '#5e6b36', '#7b8d43', '#9db05e', '#c4d488',
        '#8d6e3e', '#ba9772', '#cbb090', '#ede0cc',
        '#8C8C8C', '#B0B0B0', '#D0D0D0', '#EBEBEB',
    ],
    heatmap: ['#f5f5f0', '#dcc9ae', '#ba9772', '#8d6e3e', '#5e6b36', '#2d3d1a'],
    topClients: ['#5e6b36', '#2d3d1a', '#7b8d43', '#9db05e', '#c4d488', '#dcc9ae', '#ede0cc', '#f5f5f0'],
    yearColors: ['#5e6b36', '#8d6e3e', '#16a34a', '#9333ea', '#e11d48', '#0891b2'],
    monthColors: [
        '#2d3d1a', '#5e6b36', '#7b8d43', '#9db05e', '#c4d488', '#dcc9ae',
        '#ede0cc', '#f5f5f0', '#ba9772', '#a08060', '#8d6e3e', '#725a30',
    ],
    rankingEfficiency: [
        '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0',
        '#fde047', '#fbbf24', '#fb923c', '#f87171', '#fca5a5', '#fecaca', '#fee2e2',
    ],
    topProducts: ['#2d3d1a', '#5e6b36', '#7b8d43', '#9db05e', '#c4d488'],
    bottomProducts: ['#8d6e3e', '#ba9772', '#cbb090', '#dcc9ae', '#ede0cc'],
    otherProducts: ['#2d3d1a', '#5e6b36', '#55554d', '#7b8d43', '#9db05e', '#c4d488'],
    softColors: ['#a09f98', '#c5c3ae', '#dddbc8', '#f0efdf', '#f7f6ed'],
    barSeries: '#7b8d43',
    scatter: '#ef4444',
    lineValor: '#5e6b36',
    lineUnidades: '#8d6e3e',
    activeYear: '#8d6e3e',
    bluePalette: ['#5e6b36', '#2d3d1a', '#7b8d43', '#9db05e', '#c4d488'],
    topClientColors: ['#2d3d1a', '#8d6e3e', '#5e6b36', '#7b8d43', '#9db05e'],
};

export const table = {
    paperBg: '#FFFFFF',
    paperBorder: '#dddbc8',
    headerBg: '#f5f5f0',
    headerText: '#3c3c36',
    cellText: '#55554d',
    cellBorder: '#f0efdf',
    footerBorder: '#f0efdf',
    scrollbarThumb: 'alpha(\'#000\', 0.1)',
    scrollbarThumbLight: 'alpha(\'#000\', 0.05)',
    rowHoverBg: '#f0efdf',
    selectedRowBg: '#dddbc8',
} as const;

export const search = {
    bg: '#FFFFFF',
    border: '#dddbc8',
    focusBorder: '#8d6e3e',
    focusShadow: 'rgba(141,110,62,0.08)',
    iconColor: '#a09f98',
    clearColor: '#a09f98',
} as const;

export const axis = {
    line: '#dddbc8',
    tick: '#dddbc8',
    grid: '#f0efdf',
    tickLabel: '#a09f98',
    label: '#8a8a80',
} as const;

export const navigation = {
    sidebarBg: '#FFFFFF',
    topbarBg: '#FFFFFF',
    activeLink: '#8d6e3e',
    linkText: '#5e6b36',
    hoverBg: '#f5f5f0',
} as const;

export const toggle = {
    checked: '#8d6e3e',
    trackChecked: '#8d6e3e',
    labelActive: '#8d6e3e',
    labelDefault: '#a09f98',
} as const;

export const component = {
    logoBg: '#5e6b36',
    logoStroke: '#7b8d43',
    logoDot: '#fff',
    scrollbarThumb: '#c5c3ae',
    tooltipBg: '#3c3c36',
    tooltipText: '#fff',
    tooltipShadow: 'rgba(0,0,0,0.2)',
    tooltipShadowDark: 'rgba(0,0,0,0.25)',
    tooltipDesc: '#a09f98',
    kpiShadow: 'rgba(94,107,54,0.08)',
    cardShadow: 'rgba(94,107,54,0.07)',
    paperShadow: 'rgba(0,0,0,0.04)',
    menuShadow: 'rgba(0,0,0,0.1)',
    divider: '#dddbc8',
    separator: '#dddbc8',
    noValue: '#a09f98',
    errorText: '#EF4444',
    placeholder: '#a09f98',
    clearButtonText: '#8a8a80',
    clearButtonHover: '#8d6e3e',
    almacenButtonBorderDefault: '#dddbc8',
    almacenButtonTextDefault: '#55554d',
    almacenButtonTextSelected: '#8d6e3e',
    almacenButtonHoverBg: '#FFF',
    almacenButtonHoverBorder: '#8d6e3e',
    heatmapDefaultCell: '#f5f5f0',
    heatmapEmptyDash: '#c5c3ae',
    heatmapTodayBorder: '#8d6e3e',
    heatmapDayHeader: '#a09f98',
    treemapStroke: '#fff',
    treemapText: '#fff',
    treemapValueLabel: 'rgba(255,255,255,0.85)',
    donutArcLabel: '#fff',
    legendLabel: '#55554d',
    legendValue: '#3c3c36',
    kpiError: '#EF4444',
    kpiLoading: '#a09f98',
} as const;

export const contrast = {
    light: '#ffffff',
    dark: '#262621',
    textDark: '#3c3c36',
} as const;

export const custom = {
    headerTextAlt: '#3c3c36',
    cellTextAlt: '#55554d',
    headerBorderAlt: '#f0efdf',
    cellBorderAlt: '#f0efdf',
    selectBg: '#f5f5f0',
    selectBorder: '#dddbc8',
    selectText: '#55554d',
    selectHoverBg: '#f0efdf',
    storedText: '#3c3c36',
    searchBoxBg: '#f5f5f0',
    searchBoxBorder: '#dddbc8',
    strongText: '#3c3c36',
} as const;

export const alert = {
    error: { bg: '#FEE2E2', border: '#FECACA', text: '#DC2626' },
    success: { bg: '#DCFCE7', border: '#BBF7D0', text: '#16A34A' },
    warning: { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706' },
    info: { bg: '#ede0cc', border: '#dcc9ae', text: '#8d6e3e' },
} as const;

export const badge = {
    expired: { bg: '#FEE2E2', text: '#DC2626' },
    critical: { bg: '#FEE2E2', text: '#EF4444' },
    warning: { bg: '#FEF3C7', text: '#D97706' },
    success: { bg: '#DCFCE7', text: '#16A34A' },
    info: { bg: '#ede0cc', text: '#5e6b36' },
} as const;

export const cxc = {
    alDia: '#5e6b36',
    porVencer15d: '#7b8d43',
    vencido30d: '#9db05e',
    vencido60d: '#c4a265',
    vencido90d: '#8d6e3e',
    vencido120d: '#725a30',
    vencido120dPlus: '#4d3d20',
} as const;
