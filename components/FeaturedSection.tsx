// --- ARCHIVO FINAL Y CORREGIDO: components/FeaturedSection.tsx ---
'use client'; 

import React from 'react';
import { type Product } from '@/types'; 
import ProductCard from '@/components/ProductCard';

interface FeaturedSectionProps {
  products: Product[]; 
  isLoading?: boolean;
}

export default function FeaturedSection({ products, isLoading }: FeaturedSectionProps) {
  if (isLoading) {
    return (
      <section id="featured-products">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-center mb-10 text-slate-800">
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-slate-200 rounded-lg p-4 animate-pulse">
                <div className="w-full h-40 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="featured-products">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-center mb-4 text-slate-800">
            Featured Templates
          </h2>
          <p className="text-center text-slate-500">
            No hay productos para mostrar en este momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-4xl font-bold text-slate-800">
            Featured Templates
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ---> CORRECCIÓN: Ahora pasamos el objeto 'product' completo en una sola prop */}
          {products.map((product) => ( 
            <ProductCard
              key={product.id!}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}