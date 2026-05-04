/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#e96c2a',
                    navy: '#1a2a5e',
                    'navy-light': '#2d3f7a',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    page: '#f4f6fb',
                    muted: '#f7f8fd',
                },
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
        },
    },
    plugins: [],
}
