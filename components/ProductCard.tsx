// --- FILE: components/ProductCard.tsx ---
// CORRECTED VERSION (Accepts detailUrl prop, uses it in links)

import Image from 'next/image';
import Link from 'next/link';

// 1. Interface actualizada para incluir detailUrl
interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  type: string;
  typeIcon: string;
  buyLink?: string; // Mantenemos buyLink por si se usa para algo más que navegar
  altText?: string;
  detailUrl: string; // <-- Prop añadida y requerida
}

// 2. Componente actualizado para recibir detailUrl en las props
const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  price,
  type,
  typeIcon,
  buyLink = '#', // Valor por defecto para buyLink si no se pasa
  altText = 'Product image',
  detailUrl // <-- Prop recibida
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {/* 3. Enlace del título usa detailUrl */}
            <Link href={detailUrl} className="hover:text-primary transition line-clamp-2">
              {title}
             </Link>
          </h3>
          <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm whitespace-nowrap ml-2 flex-shrink-0">
            ${price}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-500 text-sm">
            <i className={`${typeIcon} mr-1`}></i> {type}
          </div>
          {/* 4. Enlace del botón "Buy Now" usa detailUrl */}
           <Link href={detailUrl} className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition">
             {'Buy Now'}
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;