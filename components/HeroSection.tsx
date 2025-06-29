// --- ARCHIVO FINAL Y DEFINITIVO: components/HeroSection.tsx ---
// VERSIÓN TRANSFORMADA: "Claridad y Autoridad" (Estilo Apple/Domestika)
// Reemplaza el contenido completo de tu archivo actual con este código.

import Image from 'next/image';
import Link from 'next/link';

// Es una buena práctica mantener la definición del componente limpia.
const HeroSection = (): JSX.Element => {
  return (
    // Contenedor principal con fondo blanco y padding generoso para dar "aire" y sensación de lujo.
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        {/* Usamos 'grid' para un control más robusto y moderno del layout de dos columnas. */}
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
          
          {/* --- COLUMNA IZQUIERDA: Manifiesto de Marca y Llamadas a la Acción --- */}
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
                href="/productos" // NOTA: He cambiado tu '/search' por '/productos' para más claridad. Ajústalo si es necesario.
                className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors duration-200"
              >
                Descifrar el Código
              </Link>
              <Link
                href="/vender" // NOTA: He cambiado tu '/upload' por '/vender'. Ajústalo si es necesario.
                className="group text-sm font-semibold leading-6 text-zinc-900"
              >
                Conviértete en Tiburón <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: El "Objeto de Poder" --- */}
          <div className="aspect-[3/2] w-full">
            {/*
              ACCIÓN CRÍTICA PARA TI:
              He eliminado la foto de Pexels. Este es ahora tu espacio más importante.
              Debes reemplazar este 'div' con una imagen de alta gama que represente tu marca.
              Ejemplo de implementación cuando tengas tu imagen:

              <Image
                src="/imagenes/mi-objeto-de-poder.jpg" // Sube la imagen a tu carpeta /public/imagenes
                alt="Herramientas y estrategias de negocio de Shark Market"
                width={1200}
                height={800}
                className="h-full w-full rounded-xl bg-zinc-100 object-cover shadow-2xl"
                priority
              />
            */}
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