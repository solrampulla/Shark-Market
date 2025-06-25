// --- ARCHIVO FINAL Y CORREGIDO: components/products/ProductList.tsx ---
'use client';

import { type Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        // --- INICIO DE LA CORRECCIÓN ---
        // Se reemplaza la larga lista de propiedades incorrectas
        // por la única propiedad que el componente necesita: 'product'.
        <ProductCard
          key={product.id!}
          product={product}
        />
        // --- FIN DE LA CORRECCIÓN ---
      ))}
    </div>
  );
}