// --- ARCHIVO CORREGIDO: app/product/[productid]/page.tsx ---

import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Importaciones de acciones y tipos desde sus ubicaciones correctas
import { getProductDetailsForDisplayAction } from '@/app/actions/product.actions';
import { getReviewsForProductAction } from '@/app/actions';
import { type Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: {
    productid: string; 
  };
}

// ---> NUEVO: Función para generar metadatos dinámicos para el SEO
export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = params.productid;
  const result = await getProductDetailsForDisplayAction(productId);
 
  // Si no se encuentra el producto, usamos metadatos por defecto
  if (!result.success || !result.product) {
    return {
      title: 'Producto no encontrado | Founder Market',
    }
  }
 
  const product = result.product;
 
  return {
    title: `${product.title} | Founder Market`,
    description: product.description?.substring(0, 155) || 'Descubre esta herramienta en Founder Market.',
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 155) || '',
      images: product.previewImageURL ? [product.previewImageURL] : [],
    },
  }
}

// La página principal ahora es un Server Component que carga los datos
// y los pasa al componente de cliente para la interactividad.
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const currentProductId = params.productid; 

  if (!currentProductId) {
    notFound(); 
  }

  // Se cargan los datos en el servidor
  const [productResult, reviewsResult] = await Promise.all([
    getProductDetailsForDisplayAction(currentProductId),
    getReviewsForProductAction(currentProductId)
  ]);

  // Si no se encuentra el producto, se muestra un 404
  if (!productResult.success || !productResult.product) {
    notFound(); 
  }

  return (
    // Suspense muestra un fallback mientras el componente de cliente se prepara
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Cargando producto...</div>}>
        <ProductDetailClient 
            product={productResult.product} 
            initialReviews={reviewsResult.reviews || []}
        />
    </Suspense>
  );
}