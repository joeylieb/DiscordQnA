/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            keyframes: {
                fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
                fadeOut: { "0%": { opacity: 1 }, "100%": { opacity: 0 } },
                zoomIn: {
                    "0%": { opacity: 0, transform: "scale(0.95) translate(-50%, -50%)" },
                    "100%": { opacity: 1, transform: "scale(1) translate(-50%, -50%)" }
                },
                zoomOut: {
                    "0%": { opacity: 1, transform: "scale(1) translate(-50%, -50%)" },
                    "100%": { opacity: 0, transform: "scale(0.95) translate(-50%, -50%)" }
                }
            },
            animation: {
                fadeIn: "fadeIn 200ms ease-out",
                fadeOut: "fadeOut 150ms ease-in",
                zoomIn: "zoomIn 200ms ease-out",
                zoomOut: "zoomOut 150ms ease-in"
            },
            colors: {
                background: '#0f172a',
                foreground: '#f8fafc',

                primary: {
                    DEFAULT: '#3b82f6',
                    foreground: '#ffffff',
                },

                surface: '#1e293b',
                'surface-border': '#334155',
            }
        },
    },
    plugins: [],
}