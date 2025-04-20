// --- FILE: app/product/[productId]/page.tsx ---
// FINAL VERSION (Fetches ALL from Supabase, then finds by slug)
'use client'; // Marcamos como Componente de Cliente

import React, { useState, useEffect } from 'react';
// useParams para leer el 'slug' de la URL en el cliente
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Importamos la interfaz y la función de slug desde lib
import { type Product, generateSlug } from '@/lib/sample-data';
// ¡Importamos nuestro cliente Supabase!
import { supabase } from '@/lib/supabaseClient';

// Componente de la página de detalle
export default function ProductPage() {
  // Hook para obtener los parámetros de la ruta dinámica
  const params = useParams();
  // Obtenemos el 'slug' de la URL (asegurándonos de que sea un string)
  const slugFromParams = typeof params.productId === 'string' ? params.productId : '';

  // Estados para guardar el producto encontrado, el estado de carga y posibles errores
  const [product, setProduct] = useState<Product | null>(null); // Puede ser Product o null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para cargar datos cuando el componente se monta o el slug cambia
  useEffect(() => {
    // Si no tenemos un slug válido desde la URL, no podemos buscar
    if (!slugFromParams) {
      setError('Product identifier is missing from URL.');
      setIsLoading(false);
      setProduct(null);
      return; // Salimos del efecto
    }

    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      setProduct(null); // Reseteamos producto por si acaso

      try {
        // 1. Pedimos TODOS los productos a Supabase
        // (En una app real con muchos productos, optimizaríamos esto
        // para pedir solo el que necesitamos si tuviéramos el slug en la DB)
        const { data: allProducts, error: dbError } = await supabase
          .from('products')
          .select('*');

        if (dbError) {
          throw dbError; // Lanzamos error si Supabase falla
        }

        // 2. Buscamos en la lista devuelta el producto que coincide con nuestro slug
        // Generamos el slug para cada producto de la DB para comparar
        const foundProduct = (allProducts || []).find(p => generateSlug(p.title) === slugFromParams);

        if (foundProduct) {
          setProduct(foundProduct); // Si lo encontramos, lo guardamos en el estado
        } else {
          // Si no se encuentra ningún producto con ese slug
          setError(`Product not found for identifier: ${slugFromParams}`);
        }

      } catch (e: any) {
        console.error("Failed to fetch or find product:", e);
        setError(`Failed to load product details: ${e.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false); // Marcamos la carga como finalizada
      }
    };

    fetchProductData(); // Ejecutamos la carga de datos

  // Este efecto se volverá a ejecutar si el slugFromParams cambia
  }, [slugFromParams]);

  // --- Lógica de Renderizado ---
  if (isLoading) {
    return <div className="container mx-auto p-8 text-center text-gray-500">Loading product details...</div>;
  }

  if (error) {
     return <div className="container mx-auto p-8 text-center text-red-500">Error: {error}</div>;
  }

  // Si no hay error, pero tampoco producto (por si acaso llega aquí)
  if (!product) {
     return <div className="container mx-auto p-8 text-center text-gray-500">Product data could not be loaded.</div>;
  }

  // Si llegamos aquí, tenemos el producto y lo mostramos
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Columna Imagen */}
         <div className="md:col-span-1">
           <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
             <Image
               src={product.imageUrl || '/placeholder.png'} // Fallback por si no hay imagen
               alt={`Image for ${product.title}`}
               fill
               style={{ objectFit: 'cover' }}
               sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
               priority
             />
           </div>
         </div>
         {/* Columna Detalles y Compra */}
        <div className="md:col-span-2 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="flex items-center text-gray-600 mb-4 text-lg">
            <i className={`${product.typeIcon || 'ri-file-line'} mr-2 text-xl text-primary`}></i>
            <span>{product.type}</span>
          </div>
          <p className="text-gray-700 mb-6 flex-grow">
            {/* Usamos la descripción de la DB o un texto por defecto */}
            {product.description || `Detailed information about ${product.title} will be available here.`}
          </p>
          <div className="bg-gray-100 rounded-lg p-6 mt-auto">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="text-center sm:text-left mb-4 sm:mb-0">
                 <p className="text-gray-600 text-sm mb-1">Precio:</p>
                 <p className="text-4xl font-bold text-primary">${product.price}</p>
               </div>
               {/* Enlace de compra (usamos '#' por ahora) */}
               <Link href={'#'} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition text-center text-lg">
                 Comprar Ahora
               </Link>
             </div>
          </div>
        </div>
      </div>
       {/* Placeholder para más detalles */}
       <div className="mt-12 border-t pt-8">
         <h2 className="text-2xl font-semibold mb-4">Más Detalles (Placeholder)</h2>
         <p>Información adicional sobre el contenido del paquete, formato de entrega, etc.</p>
       </div>
    </div>
  );
}