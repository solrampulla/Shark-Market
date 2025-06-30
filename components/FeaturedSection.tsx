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
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-10">
            Herramientas Destacadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ...código del esqueleto de carga... */}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="featured-products">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-4">
            Herramientas Destacadas
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
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Herramientas Destacadas
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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