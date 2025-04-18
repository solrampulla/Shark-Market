// app/product/[productId]/page.tsx (REVISED AGAIN - Client-Side Fetch)

'use client'; // Convertimos también a Componente de Cliente

import React, { useState, useEffect } from 'react'; // Importamos hooks
// useParams para leer params en cliente, notFound ya no se usa igual aquí
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Importamos SOLO la interfaz y la función de slug
import { type Product, generateSlug } from '@/lib/sample-data';

// Ya no necesitamos definir ProductPageProps

export default function ProductPage() {
  const params = useParams(); // Hook para obtener parámetros de ruta en cliente
  // Asegurarnos que productId es string o vacío
  const slugFromParams = typeof params.productId === 'string' ? params.productId : '';

  // Estados para el producto específico, carga y error
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para cargar TODOS los productos y encontrar el que necesitamos
  useEffect(() => {
    // Si no hay slug en los parámetros, no podemos buscar nada
    if (!slugFromParams) {
        setIsLoading(false);
        setError('Product ID not found in URL.');
        return; // Salimos del efecto
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/products.json'); // Pedimos la lista completa
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allProducts: Product[] = await response.json();

        // Buscamos el producto que coincida con el slug de la URL
        const foundProduct = allProducts.find(p => generateSlug(p.title) === slugFromParams);

        if (foundProduct) {
          setProduct(foundProduct); // Guardamos el producto encontrado en el estado
        } else {
          setError('Product not found.'); // Establecemos error si no se encuentra
          setProduct(null); // Nos aseguramos que no haya producto anterior
        }
      } catch (e: any) {
        console.error("Failed to fetch or find product:", e);
        setError("Failed to load product details.");
        setProduct(null);
      } finally {
        setIsLoading(false); // Terminamos la carga
      }
    };

    fetchData(); // Ejecutamos la carga
  }, [slugFromParams]); // Volvemos a ejecutar si el slug cambia (importante)

  // --- Lógica de Renderizado ---
  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Loading product details...</div>;
  }

  if (error) {
     // Mostramos un mensaje de error si algo falló o no se encontró
     return <div className="container mx-auto p-8 text-center text-red-500">Error: {error}</div>;
  }

  // Si no está cargando, no hay error, pero el producto sigue siendo null (por si acaso)
  if (!product) {
     return <div className="container mx-auto p-8 text-center text-red-500">Error: Product could not be loaded.</div>;
  }


  // Si todo está bien y tenemos el producto, mostramos sus detalles
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Column 1: Product Image */}
         <div className="md:col-span-1">
           <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
             <Image
               src={product.imageUrl}
               alt={`Image for ${product.title}`}
               fill
               style={{ objectFit: 'cover' }}
               sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
               priority
             />
           </div>
         </div>
         {/* Column 2: Product Details & Purchase */}
        <div className="md:col-span-2 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="flex items-center text-gray-600 mb-4 text-lg">
            <i className={`${product.typeIcon} mr-2 text-xl text-primary`}></i>
            <span>{product.type}</span>
          </div>
          <p className="text-gray-700 mb-6 flex-grow">
            Esta es una descripción de ejemplo para el producto '{product.title}'. Aquí irían todos los detalles sobre qué incluye el plan, para quién es ideal, y los beneficios que ofrece. ¡Un recurso invaluable para emprendedores!
          </p>
          <div className="bg-gray-100 rounded-lg p-6 mt-auto">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="text-center sm:text-left mb-4 sm:mb-0">
                 <p className="text-gray-600 text-sm mb-1">Precio:</p>
                 <p className="text-4xl font-bold text-primary">${product.price}</p>
               </div>
               {/* Usamos placeholder para el enlace de compra */}
               <Link href={'#'} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition text-center text-lg">
                 Comprar Ahora
               </Link>
             </div>
          </div>
        </div> {/* End Column 2 */}
      </div> {/* End Grid */}
       <div className="mt-12 border-t pt-8">
         <h2 className="text-2xl font-semibold mb-4">Más Detalles (Placeholder)</h2>
         <p>Información adicional sobre el contenido del paquete, formato de entrega, etc.</p>
       </div>
    </div> // End Main container
  );
}