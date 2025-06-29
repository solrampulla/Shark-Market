// --- Misión 1: Solo textos modificados ---
import Link from 'next/link';
import Image from 'next/image';
// NOTA: Ya no necesitamos SITE_HERO porque hemos puesto el texto directamente.
// import { SITE_HERO } from '@/lib/constants'; 

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          <div className="md:w-1/2 text-center md:text-left">
            
            {/* --- TEXTO MODIFICADO --- */}
            <p className="text-sm font-semibold uppercase text-accent tracking-widest mb-4">
              Acceso Validado
            </p>

            {/* --- TEXTO MODIFICADO --- */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              El Código de los Tiburones.
            </h1>

            {/* --- TEXTO MODIFICADO --- */}
            <p className="mt-6 text-lg lg:text-xl text-slate-600 max-w-xl mx-auto md:mx-0">
              Usa las mismas estrategias y sistemas de negocio que la élite para construir tu próximo gran éxito. El atajo definitivo para escalar tus resultados.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                // --- ENLACE Y TEXTO MODIFICADO ---
                href="/productos"
                className="w-full sm:w-auto inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent-hover transition-transform duration-300 hover:scale-105"
              >
                Descifrar el Código
              </Link>
              <Link
                // --- ENLACE Y TEXTO MODIFICADO ---
                 href="/vender"
                 className="w-full sm:w-auto font-semibold text-slate-700 hover:text-accent transition"
               >
                 Conviértete en Tiburón
               </Link>
            </div>
            
          </div>

            {/* --- NINGÚN CAMBIO EN LA IMAGEN TODAVÍA --- */}
          <div className="md:w-1/2 mt-8 md:mt-0">
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
