// --- ARCHIVO CORREGIDO Y MEJORADO CON LA NUEVA PROPUESTA DE VALOR ---
import Link from 'next/link';
import Image from 'next/image';
import HeroSearchBar from './HeroSearchBar';

const HeroSection = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* --- INICIO DE LA SECCIÓN DE TEXTO MEJORADA --- */}
          <div className="md:w-1/2 text-center md:text-left">
            
            {/* 1. Título (H1) nuevo, claro y directo */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              El marketplace de know-how para emprendedores y startups.
            </h1>

            {/* 2. Subtítulo de apoyo para dar más detalle */}
            <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto md:mx-0">
              Compra y vende planes de negocio, modelos financieros y estrategias validadas por expertos.
            </p>

            {/* 3. Botones de Llamada a la Acción (CTAs) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-block px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-transform duration-300 hover:scale-105"
              >
                Explorar Productos
              </Link>
              <Link
                href="/upload" // O la URL para registrarse como vendedor
                className="w-full sm:w-auto font-semibold text-slate-600 hover:text-accent transition"
              >
                ¿Eres un experto? Vende aquí
              </Link>
            </div>
            
          </div>
          {/* --- FIN DE LA SECCIÓN DE TEXTO MEJORADA --- */}

          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
              alt="Equipo de emprendedores colaborando en una startup"
              width={600}
              height={400}
              className="rounded-lg shadow-xl object-cover"
              priority 
            />
          </div>

        </div>
        
        {/* La barra de búsqueda ahora puede tener su propia sección debajo o la eliminamos de aquí si los botones son suficientes */}
        {/* Por ahora, la comentaré para que veas el impacto de los nuevos cambios. Si te gusta, luego la podemos eliminar del todo. */}
        {/* <div className="mt-16">
           <HeroSearchBar />
        </div> 
        */}

      </div>
    </section>
  );
};

export default HeroSection;