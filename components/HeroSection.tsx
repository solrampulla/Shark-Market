// --- VERSIÓN FINAL: Nuevo layout, nuevo copy, placeholder de imagen ---
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        {/* ESTRUCTURA NUEVA: Usamos 'grid' para un control perfecto de las columnas. */}
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
          
          {/* COLUMNA IZQUIERDA: Textos alineados a la izquierda en escritorio para un look más profesional. */}
          <div className="text-center lg:text-left">
            <p className="text-base font-semibold leading-7 text-orange-600">
              Acceso Validado
            </p>
            {/* TEXTO NUEVO: Eliminamos la fuente 'serif' para un look más moderno y tecnológico. */}
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              El Código de los Tiburones.
            </h1>
            {/* BAJADA REFINADA: Más corta y directa como pediste. */}
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Accede a las estrategias probadas y los sistemas de negocio de la élite. El atajo definitivo para acelerar tus resultados.
            </p>
            {/* BOTONES NUEVOS: Estilo más limpio y moderno. */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
              <Link
                href="/productos"
                className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors duration-200"
              >
                Descifrar el Código
              </Link>
              <Link
                href="/vender"
                className="group text-sm font-semibold leading-6 text-zinc-900"
              >
                Conviértete en Tiburón <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* COLUMNA DERECHA: Eliminamos la imagen de Pexels y dejamos el placeholder. */}
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
  );
};

export default HeroSection;
