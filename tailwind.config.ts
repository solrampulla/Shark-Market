// tailwind.config.ts (compatible con v3)
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Rutas para escanear:
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tus personalizaciones:
      colors: {
        primary: '#3b82f6',
        secondary: '#0ea5e9',
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
        'button': '8px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
      },
      backgroundImage: {
        // 'hero-pattern': "url(...)",
      },
    },
  },
  plugins: [],
};
export default config;