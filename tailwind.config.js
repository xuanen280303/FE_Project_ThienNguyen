/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    darkMode: ['selector', '[class*="app-dark"]'],
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

    plugins: [require('tailwindcss-primeui')],
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif']
        },
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px'
        }
    }
};
