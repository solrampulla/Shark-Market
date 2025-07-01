'use client'; 
import React from 'react';
import { type Product } from '@/types'; 
import ProductCard from '@/components/ProductCard';

interface FeaturedSectionProps {
  products: Product[]; 
  isLoading?: boolean;
}

export default function FeaturedSection({ products, isLoading }: FeaturedSectionProps) {
  
  if (isLoading || !products || products.length === 0) {
    return null; 
  }

  return (
    <section id="featured-products" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Herramientas Destacadas
          </h2>
          {/* --- SUBTÍTULO REFINADO --- */}
          <p className="mt-4 text-lg leading-8 text-zinc-600 max-w-2xl mx-auto">
            Activos curados por expertos de la industria, listos para implementar y acelerar tus resultados.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}