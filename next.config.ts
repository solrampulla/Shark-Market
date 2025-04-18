// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public.readdy.ai',
        port: '',
        pathname: '/ai/img_res/**', // Asegúrate que el pathname sea correcto
      },
    ],
  },
  // Puedes añadir otras configuraciones de Next.js aquí si las necesitas
};

export default nextConfig;