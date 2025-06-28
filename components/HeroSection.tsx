// --- VERSIÓN CON DISEÑO REVERTIDO (FONDO BLANCO) Y TEXTOS FINALES ---
import Link from 'next/link';
import Image from 'next/image';
import { SITE_HERO } from '@/lib/constants'; // Seguimos usando las constantes para el texto

const HeroSection = () => {
  return (
    // 1. VOLVEMOS AL FONDO BLANCO
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          <div className="md:w-1/2 text-center md:text-left">
            
            {/* Usamos los textos finales que definimos */}
            <p className="text-sm font-semibold uppercase text-accent tracking-widest mb-4">
              {SITE_HERO.pretitle}
            </p>

            {/* 2. AJUSTAMOS EL COLOR DEL TÍTULO PARA FONDO CLARO */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              {SITE_HERO.title}
            </h1>

            {/* 3. AJUSTAMOS EL COLOR DEL SUBTÍTULO PARA FONDO CLARO */}
            <p className="mt-6 text-lg lg:text-xl text-slate-600 max-w-xl mx-auto md:mx-0">
              {SITE_HERO.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent-hover transition-transform duration-300 hover:scale-105"
              >
                {/* El texto del botón viene de tu última imagen */}
                Explorar Estrategias
              </Link>
              {/* Dejamos el CTA secundario por si lo quieres en el futuro */}
               <Link
                 href="/upload"
                 className="w-full sm:w-auto font-semibold text-slate-700 hover:text-accent transition"
               >
                 Conviértete en Vendedor
               </Link>
            </div>
            
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0">
            {/* 4. VOLVEMOS A LA IMAGEN ORIGINAL */}
            <Image
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
              alt="Equipo de emprendedores colaborando en una startup"
              width={600}
              height={450}
              className="rounded-lg shadow-2xl object-cover"
              priority 
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;