// --- FILE: components/FeaturedSection.tsx ---
// FINAL VERSION v4 (Client-side fetch, filtering, sorting, WITH 'use client')

'use client'; // <<<--- ¡AÑADIDO IMPORTANTE!

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { generateSlug, type Product } from '@/lib/sample-data'; // Importamos Interface y Función

interface FeaturedSectionProps {
  selectedType: string | null;
  sortBy: string;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ selectedType, sortBy }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (e: any) {
        console.error("Failed to fetch products:", e);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filtrado ---
  const filteredProducts = selectedType
    ? products.filter(product => product.type === selectedType)
    : products;

  // --- Ordenamiento ---
  let sortedAndFilteredProducts = [...filteredProducts];
  switch (sortBy) {
    case 'price-asc':
      sortedAndFilteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedAndFilteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sortedAndFilteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'popular':
    default:
      // No sorting for popular or default
      break;
  }

  // --- Renderizado ---
  if (isLoading) {
    return (
       <section className="py-12 bg-white">
         <div className="container mx-auto px-4 text-center text-gray-500">
           Loading products...
         </div>
       </section>
    );
  }

  if (error) {
     return (
       <section className="py-12 bg-white">
         <div className="container mx-auto px-4 text-center text-red-500">
           Error: {error}
         </div>
       </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Business Plans & Templates</h2>
          <Link href="/templates" className="text-primary font-medium hover:underline flex-shrink-0">
            View All
          </Link>
        </div>

        {sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredProducts.map((product, index) => {
              const slug = generateSlug(product.title);
              const detailUrl = `/product/${slug}`;
              return (
                <ProductCard
                  key={slug || index}
                  imageUrl={product.imageUrl}
                  title={product.title}
                  price={product.price}
                  type={product.type}
                  typeIcon={product.typeIcon}
                  buyLink="#"
                  altText={`${product.title} image`}
                  detailUrl={detailUrl}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No products found matching the selected criteria.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;