// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {}, // Configuración simple para Tailwind v3
    autoprefixer: {}, // Para compatibilidad entre navegadores
  },
};

export default config; // Usamos export default porque es un archivo .mjs