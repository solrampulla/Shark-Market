'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { WishlistButton } from './products/WishlistButton';
import { type Product } from '@/types'; 
import RatingStars from './RatingStars'; 

interface ProductCardProps {
  product: Product;
  editUrl?: string;
  onDelete?: (productId: string, title: string) => void;
}

export default function ProductCard({ product, editUrl, onDelete }: ProductCardProps) {
  
  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
  const displayTitle = product.title || "Producto sin título";
  const displayCategory = product.category || "General";
  const detailUrl = `/product/${product.id}`;

  const handleDelete = () => {
    if (onDelete && product.id) {
      onDelete(product.id, displayTitle);
    }
  };

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-xl">
      
      <div className="relative aspect-[16/9] w-full">
        <WishlistButton productId={product.id!} initialIsWishlisted={product.isWishlisted || false} />
        <Link href={detailUrl} className="block">
          <div className="h-full w-full bg-slate-100">
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
                <span className="text-sm italic text-slate-400">Sin Imagen</span>
              </div>
            )}
          </div>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{displayCategory}</p>
        <h3 className="mt-1 text-base font-bold text-slate-800 leading-tight group-hover:text-accent transition-colors">
          <Link href={detailUrl}>
            {displayTitle}
          </Link>
        </h3>
        
        <div className="mt-2 h-5">
          {(product.reviewCount ?? 0) > 0 && (
            <div className="flex items-center">
              <RatingStars rating={product.averageRating || 0} starSize="text-xs" />
              <span className="ml-2 text-xs text-slate-400">({product.reviewCount})</span>
            </div>
          )}
        </div>

        <p className="mt-auto pt-4 text-xl font-semibold text-slate-900">
          ${displayPrice}
        </p>
      </div>

      {(editUrl || onDelete) && (
        <div className="flex items-center justify-end space-x-2 border-t border-slate-200 bg-slate-50 px-4 py-2">
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