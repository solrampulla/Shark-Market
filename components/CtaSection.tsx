// components/CtaSection.tsx
import Link from 'next/link';

const CtaSection = () => {
  return (
    // ---> CAMBIO: Fondo blanco y más espaciado para un cierre limpio.
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* ---> CAMBIO: Nuevo título principal con nuestro estilo 'serif'. */}
          <h2 className="font-serif text-4xl font-bold text-text-DEFAULT mb-4">
            Únete a Nuestra Comunidad de Expertos
          </h2>
          
          {/* ---> CAMBIO: Nuevo texto secundario, más directo. */}
          <p className="text-lg text-text-light mb-8">
            Forma parte de una comunidad de creadores y emprendedores. Comparte tu conocimiento y monetiza tu experiencia.
          </p>
          
          <div className="flex justify-center mt-8">
            {/* ---> CAMBIO: Botón rediseñado con nuestro color 'accent' y sintaxis moderna. */}
            <Link 
              href="/register?role=SELLER"
              className="inline-block px-8 py-4 bg-accent text-white text-lg font-bold rounded-md hover:bg-accent-hover transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Comienza a Vender Ahora
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;