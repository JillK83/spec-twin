/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'oklch(0.2 0 0)',
        background: 'oklch(0.96 0.01 85)',
        foreground: 'oklch(0.2 0 0)',
        card: 'oklch(0.98 0.01 85)',
        primary: {
          DEFAULT: 'oklch(0.82 0.18 85)',
          foreground: 'oklch(0.2 0 0)',
        },
        secondary: {
          DEFAULT: 'oklch(0.88 0.2 130)',
          foreground: 'oklch(0.2 0 0)',
        },
        muted: {
          DEFAULT: 'oklch(0.92 0.01 85)',
          foreground: 'oklch(0.4 0 0)',
        },
        accent: {
          teal: 'oklch(0.75 0.15 200)',
          'teal-foreground': 'oklch(0.2 0 0)',
        },
      },
      fontFamily: {
        heading: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      boxShadow: {
        hard: '4px 4px 0px 0px oklch(0.2 0 0)',
        'hard-sm': '2px 2px 0px 0px oklch(0.2 0 0)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
