/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Body copy, UI chrome, buttons, labels.
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Reserved for hero/page headlines only — used with restraint.
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // Generated strings, stats, character counts.
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // "brand" mirrors Tailwind's indigo scale under a semantic name so the
        // palette can be re-themed later without touching every component.
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Near-black indigo used for dark-mode surfaces instead of neutral black.
        ink: '#12101f',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4F46E5 0%, #E11D48 55%, #F59E0B 100%)',
        'brand-gradient-soft':
          'linear-gradient(135deg, rgba(79,70,229,0.14) 0%, rgba(225,29,72,0.14) 55%, rgba(245,158,11,0.14) 100%)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(24px, -36px) scale(1.08)' },
          '66%': { transform: 'translate(-16px, 16px) scale(0.94)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        blob: 'blob 16s infinite ease-in-out',
        'gradient-shift': 'gradient-shift 6s ease infinite',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(79, 70, 229, 0.45)',
        soft: '0 8px 30px rgba(15, 15, 35, 0.08)',
      },
    },
  },
  plugins: [],
};
