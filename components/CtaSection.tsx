// --- FILE: components/CtaSection.tsx ---
// CORRECTED VERSION

import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="py-16 bg-primary/5"> {/* Usando el color primario con baja opacidad */}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Share Your Business Know-how?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {/* Link Corregido: sin legacyBehavior, sin <a>, className en Link */}
            <Link href="/register" className="px-6 py-3 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition">
              {'Create an Account'}
            </Link>
            {/* Puedes añadir otro botón CTA si quieres, ej: "Learn More" */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;