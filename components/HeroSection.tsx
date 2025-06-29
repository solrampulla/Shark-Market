import Image from 'next/image';
import Link from 'next/link';

const HeroSection = (): JSX.Element => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="text-base font-semibold leading-7 text-orange-600">
              Acceso Validado
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              El Código de los Tiburones.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Usa las mismas estrategias y sistemas de negocio que la élite para construir
              tu próximo gran éxito. El atajo definitivo para escalar tus resultados.
            </p>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
              <Link
                href="/productos"
                className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors duration-200"
              >
                Descifrar el Código
              </a >
              <Link
                href="/vender"
                className="group text-sm font-semibold leading-6 text-zinc-900"
              >
                Conviértete en Tiburón <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </a >
            </div>
          </div>
          <div className="aspect-[3/2] w-full">
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50">
              <p className="text-center text-sm text-zinc-400 select-none">
                Espacio para tu "Imagen Heroica"
                <br />
                (Render 3D, Foto de Producto, etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
