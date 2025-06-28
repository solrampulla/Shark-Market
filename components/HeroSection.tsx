// --- VERSIÓN FINAL CON LA IMAGEN ESPECÍFICA QUE QUIERES ---
import Link from 'next/link';
import Image from 'next/image';
import { SITE_HERO } from '@/lib/constants';

const HeroSection = () => {
  return (
    <section className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          <div className="md:w-1/2 text-center md:text-left">
            
            <p className="text-sm font-semibold uppercase text-accent tracking-widest mb-4">
              {SITE_HERO.pretitle}
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {SITE_HERO.title}
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-slate-300 max-w-xl mx-auto md:mx-0">
              {SITE_HERO.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent-hover transition-transform duration-300 hover:scale-105"
              >
                Explorar Estrategias
              </Link>
            </div>
            
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0">
            {/* --- CAMBIO IMPORTANTE: AQUÍ VA TU IMAGEN --- */}
            <Image
              src="https://storage.googleapis.com/generative-ai-public/images/a6c8e310-749e-4a67-93ae-c692df874837" 
              alt="Profesional logrando el éxito con herramientas de negocio"
              width={600}
              height={600}
              className="rounded-lg shadow-2xl object-cover w-full h-full"
              priority 
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;