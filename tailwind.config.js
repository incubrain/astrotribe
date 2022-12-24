/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`
        }
        return `rgb(var(${variableName}))`
    }
}

module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
    ],
    mode: 'jit',
    theme: {
        screens: {
            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '768px',
            // => @media (min-width: 768px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
        extend: {
            textColor: {
                skin: {
                    base: withOpacity('--color-text-base'),
                    muted: withOpacity('--color-text-muted'),
                    inverted: withOpacity('--color-text-inverted'),
                },
            },
            backgroundColor: {
                skin: {
                    fill: withOpacity('--color-fill'),
                    'button-accent': withOpacity('--color-button-accent'),
                    'button-accent-hover': withOpacity(
                        '--color-button-accent-hover'
                    ),
                    'button-muted': withOpacity('--color-button-muted'),
                },
            },
            gradientColorStops: {
                skin: {
                    hue: withOpacity('--color-fill'),
                },
            },
            animation: {
                'spin-slow': 'spin 300s linear infinite',
                glitter: 'glitter 8s ease-in 0s infinite',
                'swipe-in': 'loadin 250ms ease-in-out 0s forwards',
                'pop-in': 'pop-in 250ms ease-in-out 0s forwards'
            },
            keyframes: {
                glitter: {
                    '0%': {
                        transform: 'scale(0.8)',
                        opacity: 0,
                    },
                    '25%': {
                        transform: 'scale(1.6)',
                        opacity: 1,
                    },
                    '50%': {
                        tranwidsform: 'scale(0.8)',
                        opacity: 0,
                    },
                    '75%': {
                        transform: 'scale(1.6)',
                        opacity: 1,
                    },
                    '100%': { transform: 'scale(0.8)', opacity: 0 },
                },
                'loadin': {
                    '0%': {
                        transform: 'scaleX(0)',
                    },
                    '100%': { 
                        transform: 'scaleX(1)',
                    },
                },
                'pop-in': {
                    '0%': {
                        transform: 'scale(0.9)',
                    },
                    '50%': { 
                        transform: 'scale(1.1)',
                    },
                    '100%': { 
                        transform: 'scale(1)',
                    },
                },
            },
            fontFamily: {
                body: [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'system-ui',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'Noto Sans',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
                sans: [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'system-ui',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'Noto Sans',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        // https://tailwindcss.com/docs/typography-plugin
        require('@tailwindcss/forms'),
        // https://github.com/tailwindlabs/tailwindcss-forms
    ],
}
