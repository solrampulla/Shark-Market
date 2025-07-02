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
    <section id="featured-products">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Herramientas Destacadas
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}