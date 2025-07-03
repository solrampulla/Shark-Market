import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          
          <h2 className="font-serif text-4xl font-bold text-zinc-900 mb-4">
            Únete a Nuestra Comunidad de Expertos
          </h2>
          
          <p className="text-lg text-slate-600 mb-8">
            Forma parte de una comunidad de creadores y emprendedores. Comparte tu conocimiento y monetiza tu experiencia.
          </p>
          
          <div className="flex justify-center mt-8">
            {/* --- INICIO DE LA CORRECCIÓN --- */}
            <Link 
              href="/upload" // Se cambia la ruta a /upload
              className="inline-block px-8 py-4 bg-orange-500 text-white text-lg font-bold rounded-md hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Comienza a Vender Ahora
            </Link>
            {/* --- FIN DE LA CORRECCIÓN --- */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;