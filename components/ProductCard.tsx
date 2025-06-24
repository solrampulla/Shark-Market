// --- ARCHIVO FINAL Y CORREGIDO: components/ProductCard.tsx ---
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { WishlistButton } from './products/WishlistButton';
// ---> CORRECCIÓN: Importamos el tipo 'Product' desde nuestro archivo central.
import { type Product } from '@/types'; 
import RatingStars from './RatingStars'; // Importamos el componente de estrellas

// ---> CORRECCIÓN: Actualizamos la interfaz para que coincida con nuestro tipo 'Product'
interface ProductCardProps {
  product: Product;
  // Las siguientes props son para funcionalidad extra, como en la página de "Mis Productos"
  editUrl?: string;
  onDelete?: (productId: string, title: string) => void;
}

export default function ProductCard({ product, editUrl, onDelete }: ProductCardProps) {
  
  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
  const displayTitle = product.title || "Producto sin título";
  const displayCategory = product.category || "General";
  const detailUrl = `/product/${product.id}`;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full w-full group">
      
      <div className="relative">
        <WishlistButton productId={product.id!} initialIsWishlisted={product.isWishlisted || false} />
        <Link href={detailUrl} className="block">
          <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
            {product.previewImageURL ? (
              <Image
                src={product.previewImageURL}
                alt={`Imagen de ${displayTitle}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm text-slate-400 italic">Sin Imagen</span>
              </div>
            )}
          </div>
        </Link>
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{displayCategory}</p>
        <h3 className="text-base font-bold text-slate-800 mt-1 leading-tight group-hover:text-accent transition-colors">
          <Link href={detailUrl}>
            {displayTitle}
          </Link>
        </h3>
        
        {/* Mostramos las estrellas si hay reseñas */}
        <div className="mt-2 flex items-center">
            {product.reviewCount != null && product.reviewCount > 0 ? (
                <>
                    <RatingStars rating={product.averageRating || 0} starSize="text-xs" />
                    <span className="text-xs text-slate-400 ml-2">({product.reviewCount})</span>
                </>
            ) : (
                <div className="h-4"></div> // Placeholder para mantener la altura
            )}
        </div>
        
        <p className="text-xl font-semibold text-slate-900 mt-auto pt-2">
          ${displayPrice}
        </p>
      </div>

      {(editUrl || onDelete) && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-end space-x-2">
          {editUrl && (
            <Link
              href={editUrl}
              className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded"
            >
              Editar
            </Link>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id!, product.title)}
              className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 rounded"
              aria-label="Delete Product"
            >
              Borrar
            </button>
          )}
        </div>
      )}
    </div>
  );
};