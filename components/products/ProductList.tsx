// --- NUEVO ARCHIVO: components/products/ProductList.tsx ---
// Este componente se encarga de renderizar una cuadrícula de ProductCards.
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
        <ProductCard
          key={product.id!}
          id={product.id!}
          // La página principal o de búsqueda no tiene contexto de la wishlist del usuario,
          // por lo que pasamos 'false' por defecto. Se podría mejorar más adelante.
          isWishlisted={product.isWishlisted || false}
          image_url={product.previewImageURL}
          title={product.title}
          price={product.price}
          category={product.category}
          detailUrl={`/product/${product.id}`}
          altText={`Imagen de ${product.title}`}
        />
      ))}
    </div>
  );
}