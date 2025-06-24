// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // El que ya teníamos
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'public.readdy.ai',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      // --- AÑADE ESTE ÚLTIMO BLOQUE ---
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // La nueva variación
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;