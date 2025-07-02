'use client';

import { type Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    // --- INICIO DE LA CORRECCIÓN ---
    // Se añade 'items-stretch' para asegurar que todas las tarjetas en una fila tengan la misma altura
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
      {/* Se pasa el 'index' a cada ProductCard para la animación */}
      {products.map((product, index) => (
        <ProductCard
          key={product.id!}
          product={product}
          index={index}
        />
      ))}
    </div>
    // --- FIN DE LA CORRECCIÓN ---
  );
}