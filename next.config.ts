/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mantén otras configs que tuvieras

  images: {
    remotePatterns: [
      // 1. Patrón para Supabase Storage
      {
        protocol: 'https',
        hostname: 'moswfxcwmbdbhuumsycn.supabase.co', // Tu hostname de Supabase
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 2. Patrón para las imágenes de testimonios
      {
        protocol: 'https',
        hostname: 'public.readdy.ai', // <--- AÑADIDO ESTE HOSTNAME
        port: '',
        pathname: '/ai/img_res/**', // Ruta específica si aplica, o '/**' para cualquier ruta
      },
      // Puedes añadir más objetos aquí si necesitas más dominios en el futuro
    ],
  },

  // ... otras configuraciones ...
};

// Asegúrate que la exportación sea la correcta para tu tipo de archivo (.js o .ts)
// Para .js sería:
// module.exports = nextConfig;
// Para .ts (o .js con type: "module") sería:
export default nextConfig;