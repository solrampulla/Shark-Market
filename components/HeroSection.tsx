import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="text-base font-semibold uppercase tracking-widest text-orange-600">
              Marketplace de Know-How Empresarial
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              La Ventaja que se Compra.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Accede a sistemas de negocio y estrategias 100% validadas por líderes de la industria.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              <Link 
                href="/search" // Corregido de /productos a /search
                className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-600"
              >
                Explorar Herramientas
              </Link>
              <Link 
                href="/upload" // Corregido de /vender a /upload
                className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-orange-600"
              >
                Vende tu Know-How
              </Link>
              {/* --- FIN DE LA CORRECCIÓN --- */}
            </div>
          </div>
          <div className="aspect-[3/2] w-full overflow-hidden rounded-xl">
            <Image
              src="/images/opcion-6.jpg"
              alt="Modelos de negocio y planes financieros en Shark Market"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;