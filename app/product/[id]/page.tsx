// app/product/[id]/page.tsx
// Versión con fetch integrado en el componente

import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Interfaz Product (debe coincidir con tu tabla y lib/sample-data)
interface Product {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  price: number;
  file_path: string | null;
  user_id: string;
  type: string | null;
  image_url?: string | null;
  typeIcon?: string | null;
}

// Componente de página asíncrono
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id; // Accedemos al id aquí

  console.log(`Workspaceing data directly for product ID: ${productId}`);

  // Realizamos la consulta directamente aquí
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId) // Usamos productId directamente
    .single();

  // Manejo de errores y 'no encontrado'
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching product:', productId, error);
    // Considera lanzar un error para un Error Boundary si lo tienes
  }

  if (!product) {
    notFound(); // Muestra página 404
  }

  // Renderizado (igual que antes)
  return (
    <div className="container mx-auto p-4 md:p-8">
       <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Volver a la lista</Link>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Columna Imagen */}
         <div className="md:col-span-1">
           <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
             <Image
               src={product.image_url || '/placeholder.png'}
               alt={`Imagen de ${product.title}`}
               fill
               style={{ objectFit: 'cover' }}
               sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
               priority
             />
           </div>
         </div>

         {/* Columna Detalles y Compra */}
        <div className="md:col-span-2 flex flex-col">
           <h1 className="text-3xl md:text-4xl font-bold font-pacifico text-gray-900 mb-2">{product.title}</h1>
           <div className="flex items-center text-gray-600 mb-4 text-lg">
             <i className={`${product.typeIcon || 'ri-file-line'} mr-2 text-xl text-primary`}></i>
             <span>{product.type || 'General'}</span>
           </div>
           <p className="text-gray-700 mb-6 flex-grow whitespace-pre-wrap">
             {product.description || `Información detallada sobre ${product.title}.`}
           </p>
           <div className="bg-gray-100 rounded-lg p-6 mt-auto">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="text-center sm:text-left mb-4 sm:mb-0">
                 <p className="text-gray-600 text-sm mb-1">Precio:</p>
                 <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
               </div>
               <Link href={'#'} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition text-center text-lg">
                 Comprar Ahora
               </Link>
             </div>
           </div>
         </div>
       </div>

        {/* Placeholder para más detalles */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Más Detalles</h2>
          <p>Aquí podría ir información adicional, especificaciones, etc.</p>
          <p className="text-xs text-gray-400 mt-4">ID Producto (Debug): {product.id}</p>
          <p className="text-xs text-gray-400">Ruta Archivo (Debug): {product.file_path}</p>
        </div>
    </div>
  );
}