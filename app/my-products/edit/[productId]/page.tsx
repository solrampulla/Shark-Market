// ========================================================================
// CÓDIGO FINAL, CORREGIDO Y VALIDADO
// RUTA: app/my-products/edit/[productId]/page.tsx
// ========================================================================
'use server';

import { notFound } from 'next/navigation';
import Link from 'next/link';

// ---> CORRECCIÓN: Se actualizan las rutas de importación.
import { getProductDetailsForDisplayAction } from '@/app/actions/product.actions';
import { type Product } from '@/types';

import EditProductForm from '@/components/edit/EditProductForm';
import ClientOnly from '@/components/ClientOnly';

// Tu interfaz original era correcta.
interface EditProductPageProps {
  params: { productId?: string }; 
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  
  // Tu lógica para leer el parámetro era correcta.
  const productId = params.productId;

  if (!productId) { 
    return notFound(); 
  }
  
  const result = await getProductDetailsForDisplayAction(productId);
  
  if (!result.success || !result.product) { 
    return notFound(); 
  }

  const productData = result.product;
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <Link href="/">
                    <span className="font-serif text-4xl font-bold text-slate-800">Founder Market</span>
                </Link>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
                    Editar Producto
                </h1>
                <p className="mt-2 text-lg text-slate-500 truncate">
                    Estás editando: <span className="font-semibold">{productData.title}</span>
                </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-lg">
                <ClientOnly>
                    {/* Pasamos los datos al formulario. El 'as Product' confirma el tipo a TypeScript. */}
                    <EditProductForm initialData={productData as Product} />
                </ClientOnly>
            </div>
        </div>
      </div>
    </div>
  );
}