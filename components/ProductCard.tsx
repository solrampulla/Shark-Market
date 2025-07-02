'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { WishlistButton } from './products/WishlistButton';
import { type Product } from '@/types';
import RatingStars from './RatingStars';

interface ProductCardProps {
  product: Product;
  index: number; // <-- NUEVA PROPIEDAD para el retraso de la animación
  editUrl?: string;
  onDelete?: (productId: string, title: string) => void;
}

export default function ProductCard({ product, index, editUrl, onDelete }: ProductCardProps) {
  
  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
  const displayTitle = product.title || "Activo sin título";
  const displayCategory = product.category || "General";
  const detailUrl = `/product/${product.id}`;

  const handleDelete = () => {
    if (onDelete && product.id) {
      onDelete(product.id, displayTitle);
    }
  };

  return (
    <div 
      className="group animate-fadeInUp relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms`, willChange: 'transform, opacity' }}
    >
      <div className="relative aspect-video w-full">
        <WishlistButton productId={product.id!} initialIsWishlisted={product.isWishlisted || false} />
        <Link href={detailUrl} className="block h-full w-full">
          <div className="h-full w-full bg-slate-50">
            {product.previewImageURL ? (
              <Image
                src={product.previewImageURL}
                alt={`Imagen de ${displayTitle}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-sm italic text-zinc-400">Sin Imagen</span>
              </div>
            )}
          </div>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <Link href={detailUrl} className="flex-grow">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">{displayCategory}</p>
          <h3 className="mt-1 h-12 text-base font-bold leading-tight text-zinc-900 line-clamp-2">
            {displayTitle}
          </h3>
          <div className="mt-2 flex h-5 items-center">
            {(product.reviewCount ?? 0) > 0 ? (
              <>
                <RatingStars rating={product.averageRating || 0} starSize="text-sm" />
                <span className="ml-2 text-xs text-zinc-500">({product.reviewCount})</span>
              </>
            ) : (
              <span className="text-xs text-zinc-400">Sin valoraciones</span>
            )}
          </div>
        </Link>
        
        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
          <div className="flex items-center gap-2">
            <Image
              src={product.sellerAvatarUrl || '/images/default-avatar.png'}
              alt={`Avatar de ${product.sellerName || 'Vendedor'}`}
              width={24}
              height={24}
              className="rounded-full bg-slate-200 object-cover"
            />
            <span className="text-xs font-medium text-zinc-600">{product.sellerName || 'Anónimo'}</span>
          </div>
          <p className="text-xl font-bold text-zinc-900">
            ${displayPrice}
          </p>
        </div>
      </div>

      {(editUrl || onDelete) && (
        <div className="flex items-center justify-end space-x-2 border-t border-zinc-200 bg-zinc-50 px-4 py-2">
          {editUrl && (
            <Link href={editUrl} className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
              Editar
            </Link>
          )}
          {onDelete && (
            <button onClick={handleDelete} className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100" aria-label="Delete Product">
              Borrar
            </button>
          )}
        </div>
      )}
    </div>
  );
}