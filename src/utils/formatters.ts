import { APP_CONFIG } from '../config/constants';

export const formatNumber = (value: number): string => {
    return value.toLocaleString(APP_CONFIG.defaultLocale);
};
