/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // Wedding theme colors
                primary: {
                    DEFAULT: '#4b0101',
                    50: '#fdf2f2',
                    100: '#fce4e4',
                    200: '#facece',
                    300: '#f5abab',
                    400: '#ed7979',
                    500: '#e04f4f',
                    600: '#cc3131',
                    700: '#aa2525',
                    800: '#8c2222',
                    900: '#4b0101',
                    950: '#2a0000',
                },
                success: '#2e7d32',
                error: '#c62828',
            },
            fontFamily: {
                serif: ['"Libre Baskerville"', '"Amiri"', 'Georgia', 'serif'],
                arabic: ['"Amiri"', '"Libre Baskerville"', 'Georgia', 'serif'],
            },
            fontSize: {
                'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.85rem)', { lineHeight: '1.5' }],
                'sm': ['clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', { lineHeight: '1.5' }],
                'base': ['clamp(1rem, 0.9rem + 0.5vw, 1.15rem)', { lineHeight: '1.5' }],
                'lg': ['clamp(1.125rem, 1rem + 0.6vw, 1.35rem)', { lineHeight: '1.4' }],
                'xl': ['clamp(1.5rem, 1.25rem + 1.25vw, 2rem)', { lineHeight: '1.3' }],
                '2xl': ['clamp(1.875rem, 1.5rem + 1.75vw, 2.75rem)', { lineHeight: '1.2' }],
            },
            spacing: {
                'header': 'clamp(90px, 75px + 4vw, 120px)',
                'page-pad': 'clamp(1rem, 0.75rem + 1.25vw, 1.75rem)',
                'safe-bottom': 'env(safe-area-inset-bottom, 0)',
            },
            maxWidth: {
                'content': 'min(92vw, 480px)',
            },
            borderRadius: {
                'card': 'clamp(12px, 10px + 1vw, 20px)',
                'sm-card': 'clamp(8px, 6px + 0.75vw, 12px)',
            },
            boxShadow: {
                'card': '0 6px 24px rgba(0, 0, 0, 0.35)',
            },
            backdropBlur: {
                'card': '10px',
            },
            animation: {
                'fade-in': 'fadeIn 0.15s ease-out both',
                'slide-in': 'slideIn 0.15s ease-out both',
                'slide-in-rtl': 'slideInRTL 0.15s ease-out both',
                'spin': 'spin 0.7s linear infinite',
                'check-circle': 'checkCircle 0.5s ease forwards',
                'check-mark': 'checkMark 0.3s ease forwards',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(6px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    from: { opacity: '0', transform: 'translateX(-8px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRTL: {
                    from: { opacity: '0', transform: 'translateX(8px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                checkCircle: {
                    to: { strokeDashoffset: '0' },
                },
                checkMark: {
                    to: { strokeDashoffset: '0' },
                },
            },
        },
    },
    plugins: [],
};
