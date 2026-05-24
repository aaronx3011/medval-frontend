import { APP_CONFIG } from '../config/constants';

export const formatNumber = (value: number): string => {
    return value.toLocaleString(APP_CONFIG.defaultLocale);
};

export const formatCompact = (value: number, decimals = 2): string => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(decimals)}b`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(decimals)}m`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(decimals)}k`;
    return value.toFixed(decimals);
};
