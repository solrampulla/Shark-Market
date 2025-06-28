// --- VERSIÓN CON MÁS ESPACIO SUPERIOR ---
import Link from 'next/link';
import Image from 'next/image';
import { SITE_HERO } from '@/lib/constants';

const HeroSection = () => {
  return (
    <section className="bg-white">
      {/* CORRECCIÓN: Aumentamos el padding vertical (el valor de 'py').
        Cambiamos 'py-16' por 'py-24' y 'py-24' por 'py-32'.
        Esto añade más espacio en blanco arriba y abajo de la sección.
      */}
      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          <div className="md:w-1/2 text-center md:text-left">
            
            <p className="text-sm font-semibold uppercase text-accent tracking-widest mb-4">
              {SITE_HERO.pretitle}
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              {SITE_HERO.title}
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-slate-600 max-w-xl mx-auto md:mx-0">
              {SITE_HERO.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent-hover transition-transform duration-300 hover:scale-105"
              >
                Explorar Estrategias
              </Link>
              <Link
                 href="/upload"
                 className="w-full sm:w-auto font-semibold text-slate-700 hover:text-accent transition"
               >
                 Conviértete en Vendedor
               </Link>
            </div>
            
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src="c:\Users\sole0\Desktop\222d5573-340f-4107-82ae-2123063a7404.png" 
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