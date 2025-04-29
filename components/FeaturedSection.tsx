// components/FeaturedSection.tsx
// Versión con ordenación por 'Newest' implementada
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { type Product } from '@/lib/sample-data'; // Asegúrate que Product incluye created_at
import { supabase } from '@/lib/supabaseClient';

interface FeaturedSectionProps {
  selectedType: string | null;
  sortBy: string;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ selectedType, sortBy }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Seleccionamos todo, incluyendo created_at
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*');

        if (dbError) throw dbError;
        setAllProducts(data || []);
      } catch (e: any) {
        console.error("Failed to fetch products from Supabase:", e);
        setError(`Failed to load products: ${e.message || 'Unknown error'}`);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Lógica de Filtrado y Ordenamiento (con 'newest' actualizado) ---
  const filteredProducts = selectedType
    ? allProducts.filter(product => product.type === selectedType)
    : allProducts;

  let sortedAndFilteredProducts = [...filteredProducts];
  switch (sortBy) {
    case 'price-asc':
      sortedAndFilteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedAndFilteredProducts.sort((a, b) => b.price - a.price);
      break;
    // --- INICIO: Lógica para 'newest' ---
    case 'newest':
      sortedAndFilteredProducts.sort((a, b) => {
        // Convertimos las fechas (que vienen como string) a objetos Date para comparar
        // Asumimos que created_at existe en el tipo Product y en los datos
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        // Orden descendente (el más reciente, que tiene mayor timestamp, primero)
        return dateB - dateA;
      });
      break;
    // --- FIN: Lógica para 'newest' ---
    case 'popular': // Aún sin lógica específica, se queda con el orden de filtro
    default:
      // No aplicamos ordenación extra por defecto o para 'popular' por ahora
      break;
  }
  // --- Fin Filtrado y Ordenamiento ---


  // --- Lógica de Renderizado (sin cambios) ---
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
            {sortedAndFilteredProducts.map((product) => {
              const detailUrl = `/product/${product.id}`;
              return (
                <ProductCard
                  key={product.id}
                  image_url={product.image_url || '/placeholder.png'}
                  title={product.title}
                  price={product.price}
                  type={product.type || 'General'}
                  type_icon={product.type_icon || 'ri-file-line'}
                  altText={`${product.title} image`}
                  detailUrl={detailUrl}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
             {allProducts.length === 0 ? 'No products available yet.' : 'No products found matching the selected criteria.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;