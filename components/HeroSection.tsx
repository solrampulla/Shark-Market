// --- VERSIÓN FINAL Y DEFINITIVA de components/HeroSection.tsx ---
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          {/* --- Columna de Texto (Izquierda) --- */}
          <div className="md:w-1/2 text-center md:text-left">
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Tu marketplace de know-how empresarial.
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-slate-600 max-w-xl mx-auto md:mx-0">
              Herramientas y estrategias de expertos, listas para lanzar y escalar tu negocio.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent-hover transition-transform duration-300 hover:scale-105"
              >
                Explorar el Marketplace
              </Link>
              <Link
                href="/upload"
                className="w-full sm:w-auto font-semibold text-slate-700 hover:text-accent transition"
              >
                Conviértete en Vendedor
              </Link>
            </div>
            
          </div>

          {/* --- Columna de Imagen (Derecha) --- */}
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