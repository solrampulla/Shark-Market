// --- ARCHIVO FINAL Y CORREGIDO: app/product/[productid]/page.tsx ---
'use server';

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getProductDetailsForDisplayAction } from '@/app/actions/product.actions';
import { getReviewsForProductAction } from '@/app/actions'; // Asumo que esta acción existe
import { type Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: {
    productid: string; 
  };
}

// Función para generar metadatos dinámicos para el SEO
export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = params.productid; 
  const result = await getProductDetailsForDisplayAction(productId);
  
  if (!result.success || !result.product) {
    return {
      title: 'Producto no encontrado | Shark Market',
    }
  }
  
  const product = result.product;
  // Usamos la imagen de portada o la del vendedor para el Open Graph
  const imageUrl = product.sellerImageUrl || product.coverImageUrl;
  
  return {
    title: `${product.title} | Shark Market`,
    description: product.description?.substring(0, 155) || 'Descubre esta herramienta en Shark Market.',
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 155) || '',
      // --- CORRECCIÓN: Usamos la nueva propiedad 'coverImageUrl' o 'sellerImageUrl' ---
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// El componente de la página, que es un Server Component
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

  if (!productResult.success || !productResult.product) {
    notFound(); 
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><p>Cargando producto...</p></div>}>
        <ProductDetailClient 
            product={productResult.product!} 
            initialReviews={reviewsResult.reviews || []}
        />
    </Suspense>
  );
}