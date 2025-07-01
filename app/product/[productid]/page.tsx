// --- ARCHIVO FINAL Y CORREGIDO ---

'use server';



import type { Metadata, ResolvingMetadata } from 'next';

import { notFound } from 'next/navigation';

import { Suspense } from 'react';



import { getProductDetailsForDisplayAction } from '@/app/actions/product.actions';

import { getReviewsForProductAction } from '@/app/actions';

import { type Product } from '@/types';

import ProductDetailClient from './ProductDetailClient';



// --- CORRECCIÓN FINAL ---

// El nombre del parámetro ahora es 'productid' (minúsculas) para coincidir con el nombre de la carpeta.

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

  // --- CORRECCIÓN FINAL --- Se usa params.productid

  const productId = params.productid;

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

  // --- CORRECCIÓN FINAL --- Se usa params.productid

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