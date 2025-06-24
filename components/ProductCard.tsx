// --- FILE: components/ProductCard.tsx ---
// UPDATED to include the WishlistButton

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
// ---> 1. IMPORTAMOS EL NUEVO BOTÓN
import { WishlistButton } from './products/WishlistButton'; // Ajusta la ruta si es necesario

// ---> 2. AÑADIMOS LA NUEVA PROP
interface ProductCardProps {
  id: string;
  isWishlisted: boolean; // Para saber el estado inicial del corazón
  // ... resto de tus props (image_url, title, etc.)
  image_url?: string | null;
  title: string;
  price: number;
  category: string;
  altText?: string;
  detailUrl: string;
  editUrl?: string;
  onDelete?: (productId: string, title: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  isWishlisted, // Usamos la nueva prop
  image_url,
  title,
  price,
  category,
  altText,
  detailUrl,
  editUrl,
  onDelete,
}) => {
  const displayPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';
  const displayTitle = title || "Producto sin título";
  const displayCategory = category || "General";
  const displayAltText = altText || `Imagen de ${displayTitle}`;

  return (
    <div className="bg-background-card rounded-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full w-full group">
      
      {/* El Link ahora es relativo para que el botón funcione dentro */}
      <div className="relative">
        {/* ---> 3. AÑADIMOS EL BOTÓN AQUÍ */}
        <WishlistButton productId={id} initialIsWishlisted={isWishlisted} />
        <Link href={detailUrl} className="block">
          <div className="relative w-full aspect-video overflow-hidden">
            {image_url ? (
              <Image
                src={image_url}
                alt={displayAltText}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <span className="text-sm text-slate-400 italic">Sin Imagen</span>
              </div>
            )}
          </div>
        </Link>
      </div>
      
      {/* Envolvemos el texto en un Link también */}
      <Link href={detailUrl} className="flex flex-col flex-grow p-4">
          <p className="text-xs font-semibold uppercase text-text-light tracking-wider">{displayCategory}</p>
          <h3 className="text-lg font-bold text-text-DEFAULT mt-1 leading-tight line-clamp-2">
            {displayTitle}
          </h3>
          <p className="text-xl font-semibold text-text-DEFAULT mt-auto pt-2">
            ${displayPrice}
          </p>
      </Link>

      {(editUrl || onDelete) && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-end space-x-2">
          {editUrl && (
            <Link
              href={editUrl}
              className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded"
            >
              <i className="ri-pencil-line mr-1"></i>Editar
            </Link>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id, title)}
              className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 rounded"
              aria-label="Delete Product"
            >
              <i className="ri-delete-bin-line mr-1"></i>Borrar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;