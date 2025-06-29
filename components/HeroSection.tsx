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
              Accede a sistemas de negocio y estrategias validadas por líderes de la industria.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              
              <Link 
                href="/productos" 
                className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Accede a las Herramientas
              </Link>
              
              <Link 
                href="/vender" 
                className="group text-sm font-semibold leading-6 text-zinc-900"
              >
                Conviértete en Tiburón
              </Link>
            </div>
          </div>
          
          {/* --- BLOQUE DE IMAGEN ACTUALIZADO --- */}
          <div className="aspect-[3/2] w-full">
            <Image
              src="/images/opcion-3.jpg" // <-- ¡RECUERDA CAMBIAR ESTA LÍNEA!
              alt="Herramientas y estrategias de negocio de Shark Market"
              width={1200}
              height={800}
              // Añadimos "object-center" para priorizar la parte superior
              className="h-full w-full rounded-xl bg-zinc-100 object-cover object-center shadow-xl"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;