// --- FILE: components/TestimonialsSection.tsx ---
// REFACTORED AND TRANSLATED

import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  // ---> CAMBIO: Datos de testimonios actualizados, en español y más relevantes.
  const testimonials = [
    { rating: 5, text: "Pude monetizar mis plantillas de Excel, llegando a emprendedores de todo el mundo. La plataforma es increíblemente fácil de usar.", imageUrl: "https://public.readdy.ai/ai/img_res/bed0bbe257160d5189085275ef3868fc.jpg", name: "Carlos Jiménez", title: "Consultor Financiero" },
    { rating: 5, text: "Las plantillas listas para usar me ayudaron a lanzar mi startup en la mitad de tiempo y crecer un 40% en seis meses.", imageUrl: "https://public.readdy.ai/ai/img_res/fd8b003a4401dbbc3fa7720a046b1622.jpg", name: "Laura Núñez", title: "Fundadora de Startup" },
    { rating: 5, text: "Su plan de negocio para restaurantes me ahorró incontables horas y fue clave para conseguir la financiación para mi nuevo local.", imageUrl: "https://public.readdy.ai/ai/img_res/76a72f3edb213f40d9115ad481af657e.jpg", name: "Sofía Rodríguez", title: "Dueña de Restaurante" },
  ];

  return (
    // ---> CAMBIO: Usamos nuestro color de fondo temático y ajustamos el padding.
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          {/* ---> CAMBIO: Título con nuevo estilo y traducción. */}
          <h2 className="font-serif text-4xl font-bold text-text-DEFAULT mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          {/* ---> NUEVO: Subtítulo para dar más contexto. */}
          <p className="text-lg text-text-light max-w-3xl mx-auto">
            Historias de éxito de nuestra comunidad de expertos y emprendedores que confían en Founder Market.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;