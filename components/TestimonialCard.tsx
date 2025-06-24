// --- FILE: components/TestimonialCard.tsx ---
// REFACTORED AND TRANSLATED

import Image from 'next/image';

// ---> ELIMINADO: La importación de RatingStars ya no es necesaria.

interface TestimonialCardProps {
  rating: number;
  text: string;
  imageUrl: string;
  name: string;
  title: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ rating, text, imageUrl, name, title }) => {
  return (
    // ---> CAMBIO: Nuevo estilo de tarjeta para consistencia, con mejor hover.
    <div className="bg-background-card rounded-lg border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full w-full">
      
      {/* ---> CAMBIO: Estrellas generadas directamente aquí y con nuestro color 'accent'. */}
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <i
            key={index}
            className={`ri-star-fill text-xl ${index < rating ? 'text-accent' : 'text-slate-300'}`}
          ></i>
        ))}
      </div>

      {/* ---> CAMBIO: Estilo de texto actualizado y con 'flex-grow' para alinear autores. */}
      <p className="text-text-light mb-6 flex-grow italic">"{text}"</p>
      
      {/* ---> CAMBIO: 'mt-auto' para empujar al autor al fondo de la tarjeta. */}
      <div className="flex items-center mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={`Foto de ${name}`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          {/* ---> CAMBIO: Estilos de texto actualizados con nuestros colores de tema. */}
          <h4 className="font-semibold text-text-DEFAULT">{name}</h4>
          <p className="text-sm text-text-light">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;