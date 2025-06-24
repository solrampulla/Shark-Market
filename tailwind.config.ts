// --- ARCHIVO ACTUALIZADO: tailwind.config.ts ---
// CAMBIO: Se añade el plugin @tailwindcss/typography.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        text: {
          DEFAULT: '#1f2937',
          light: '#6b7280',
        },
        background: {
          DEFAULT: '#F9FAFB',
          card: '#FFFFFF',
        },
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'full': '9999px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      backgroundImage: {
        // 'hero-pattern': "url(...)",
      },
    },
  },
  // ---> CORRECCIÓN: Añadimos el plugin de tipografía.
  plugins: [],
};
export default config;