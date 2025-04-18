// --- FILE: components/TestimonialCard.tsx ---

import Image from 'next/image';
import RatingStars from './RatingStars'; // Importa el helper de estrellas

interface TestimonialCardProps {
  rating: number;
  text: string;
  imageUrl: string;
  name: string;
  title: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ rating, text, imageUrl, name, title }) => {
  return (
     // Added flex flex-col and h-full for consistent height in grid
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <div className="mb-4">
        <RatingStars rating={rating} />
      </div>
      <p className="text-gray-700 mb-6 flex-grow">{text}</p> {/* flex-grow para alinear los autores */}
      <div className="flex items-center mt-auto"> {/* mt-auto para empujar al fondo */}
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={`Photo of ${name}`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;