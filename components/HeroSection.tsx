// --- FILE: components/HeroSection.tsx ---
// CORRECTED VERSION

import Link from 'next/link';

const HeroSection = () => {
  return (
    // Aplicar la clase para el fondo desde globals.css
    <section className="hero-section-bg relative">
      {/* Overlay Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/20"></div>
      {/* Contenido */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Share Your Business Know-how
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Turn your business expertise into a valuable asset. Sell your templates to entrepreneurs.
          </p>
          <div className="flex flex-wrap gap-4">
            {/* Link Corregido: sin legacyBehavior, sin <a>, className en Link */}
            <Link href="/templates" className="px-6 py-3 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition inline-block">
              {'Explore Templates'}
            </Link>
             {/* Puedes añadir más botones si es necesario */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;