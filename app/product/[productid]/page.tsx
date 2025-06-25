// --- ARCHIVO FINAL Y CORREGIDO ---
'use server';

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Importaciones de acciones y tipos
import { getProductDetailsForDisplayAction } from '@/app/actions/product.actions';
import { getReviewsForProductAction } from '@/app/actions';
import { type Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';

// --- CORRECCIÓN ---
// La interfaz ahora usa 'productId' para coincidir con el nombre de la carpeta '[productId]'
interface ProductDetailPageProps {
  params: {
    productId: string; 
  };
}

// Función para generar metadatos dinámicos para el SEO
export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // --- CORRECCIÓN --- Se usa params.productId
  const productId = params.productId; 
  const result = await getProductDetailsForDisplayAction(productId);
  
  if (!result.success || !result.product) {
    return {
      title: 'Producto no encontrado | Shark Market',
    }
  }
  
  const product = result.product;
  
  return {
    title: `${product.title} | Shark Market`,
    description: product.description?.substring(0, 155) || 'Descubre esta herramienta en Shark Market.',
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 155) || '',
      images: product.previewImageURL ? [product.previewImageURL] : [],
    },
  }
}

// El componente de la página, que es un Server Component
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // --- CORRECIÓN --- Se usa params.productId
  const currentProductId = params.productId; 

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
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><p>Cargando producto...</p></div>}>
        <ProductDetailClient 
            product={productResult.product} 
            initialReviews={reviewsResult.reviews || []}
        />
    </Suspense>
  );
}