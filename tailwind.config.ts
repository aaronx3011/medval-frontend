/** @type {import('tailwindcss').Config} */
import { brand, surface } from './src/config/colors'

export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: brand.orange,
                    navy: brand.navy,
                    'navy-light': brand.navyLight,
                },
                surface: {
                    DEFAULT: surface.white,
                    page: surface.page,
                    muted: surface.muted,
                },
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
        },
    },
    plugins: [],
}
