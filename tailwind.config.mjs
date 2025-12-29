/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#4b0101',
                success: '#2e7d32',
                error: '#c62828',
            },
            fontFamily: {
                serif: ['"Libre Baskerville"', '"Amiri"', 'Georgia', 'serif'],
            },
        },
    },
    plugins: [],
};
