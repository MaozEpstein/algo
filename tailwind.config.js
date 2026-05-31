/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Semantic highlight-role palette (used by the visualization)
        role: {
          comparing: '#f59e0b', // amber
          largest: '#a855f7',   // violet
          swapping: '#fb7185',  // rose
          current: '#38bdf8',   // sky
          sorted: '#34d399',    // emerald
          inserted: '#22d3ee',  // cyan
          extracted: '#fb7185', // rose
          path: '#818cf8',      // indigo
        },
        canvas: {
          DEFAULT: '#0f172a', // slate-900 viz canvas
          soft: '#1e293b',
        },
      },
      boxShadow: {
        node: '0 4px 14px -2px rgba(0,0,0,0.35)',
        glow: '0 0 0 4px rgba(56,189,248,0.25)',
        card: '0 10px 40px -12px rgba(15,23,42,0.25)',
      },
      keyframes: {
        'pulse-ok': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(52,211,153,0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(52,211,153,0.35)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        'pulse-ok': 'pulse-ok 0.6s ease-out',
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
