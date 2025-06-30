// --- VERSIÓN DE BASE SEGURA: components/ProductCard.tsx ---
'use client';

import Link from 'next/link';
import { type Product } from '@/types'; 

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {

  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
  const displayTitle = product.title || "Activo sin título";
  const detailUrl = `/product/${product.id}`;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="h-40 w-full rounded bg-zinc-100 mb-4"></div> {/* Placeholder para la imagen */}
      <h3 className="font-bold text-zinc-900 truncate">
        <Link href={detailUrl}>
          {displayTitle}
        </Link>
      </h3>
      <p className="mt-4 text-lg font-semibold text-zinc-800">
        ${displayPrice}
      </p>
    </div>
  );
}