// --- VERSIÓN FINAL Y UNIFICADA: components/ProductCard.tsx ---
// Acepta props opcionales para ser compatible en toda la web.
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { WishlistButton } from './products/WishlistButton';
import { type Product } from '@/types'; 
import RatingStars from './RatingStars'; 

// Definimos la interfaz para que acepte las propiedades opcionales
interface ProductCardProps {
  product: Product;
  editUrl?: string;
  onDelete?: (productId: string, title: string) => void;
}

export default function ProductCard({ product, editUrl, onDelete }: ProductCardProps) {
  
  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
  const displayTitle = product.title || "Activo sin título";
  const displayCategory = product.category || "General";
  const detailUrl = `/product/${product.id}`;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id!, displayTitle);
    }
  };

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow duration-300 hover:shadow-2xl">
      
      {/* SECCIÓN DE IMAGEN */}
      <div className="relative aspect-[16/9] w-full">
        <WishlistButton productId={product.id!} initialIsWishlisted={product.isWishlisted || false} />
        <Link href={detailUrl}>
          <div className="h-full w-full bg-zinc-100">
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
      
      {/* SECCIÓN DE CONTENIDO Y PRECIO */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">{displayCategory}</p>
        <h3 className="mt-1 text-base font-bold leading-tight text-zinc-900">
          <Link href={detailUrl}>
            <span className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-300 group-hover:bg-[length:100%_2px]">
              {displayTitle}
            </span>
          </Link>
        </h3>
        
        <div className="mt-2 h-5">
          {(product.reviewCount ?? 0) > 0 && (
            <div className="flex items-center">
              <RatingStars rating={product.averageRating || 0} starSize="text-xs" />
              <span className="ml-2 text-xs text-zinc-500">({product.reviewCount})</span>
            </div>
          )}
        </div>

        <p className="mt-auto pt-4 text-xl font-bold text-zinc-900">
          ${displayPrice}
        </p>
      </div>

      {/* --- SECCIÓN DE BOTONES (SOLO APARECE SI SE PASA editUrl o onDelete) --- */}
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