import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="text-base font-semibold text-orange-600">
              Acceso Validado
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              El Código de los Tiburones.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Accede a las estrategias probadas y los sistemas de negocio de la élite. El atajo definitivo para acelerar tus resultados.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link href="/productos" className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
                Descifrar el Código
              </Link>
              <Link href="/vender" className="group text-sm font-semibold leading-6 text-zinc-900">
                Conviértete en Tiburón{' '}
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div className="aspect-[3/2] w-full">
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50">
              <p className="select-none text-sm text-zinc-400">
                Espacio para tu "Imagen Heroica"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
