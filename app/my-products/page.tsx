// app/my-products/page.tsx (Revisado - Asegura llave final)
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/sample-data';

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserProducts = async () => {
    setLoading(true);
    setError(null);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) { setError("Error al obtener la sesión."); setLoading(false); return; }
    if (!session) { router.push('/login'); return; }
    const userId = session.user.id;
    try {
      const { data: userProducts, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId);
      if (dbError) throw dbError;
      setProducts(userProducts || []);
    } catch (e: any) {
      console.error("Failed to fetch user products:", e);
      setError(`Failed to load products: ${e.message || 'Unknown error'}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo al montar

  const handleDelete = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar este producto? Esta acción no se puede deshacer.')) {
      return;
    }
    console.log(`Intentando borrar producto ID: ${productId}`);
    setError(null);
    try {
      // Nota: Idealmente buscar file_path, image_url_path antes para borrar de Storage.
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) { throw deleteError; }
      console.log(`Producto ${productId} borrado de la DB.`);
      setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
      alert('Producto borrado con éxito.');
    } catch (error: any) {
      console.error("Error al borrar producto:", error);
      setError(`Error al borrar: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleEdit = (productId: string) => {
    console.log(`Navegando a editar producto ID: ${productId}`);
    router.push(`/my-products/edit/${productId}`); // Ruta futura
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Cargando tus productos...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Mis Productos Subidos</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const detailUrl = `/product/${product.id}`;
            return (
              <ProductCard
                key={product.id}
                productId={product.id}
                image_url={product.image_url || '/placeholder.png'}
                title={product.title}
                price={product.price}
                type={product.type || 'General'}
                type_icon={product.type_icon || 'ri-file-line'}
                altText={`${product.title} image`}
                detailUrl={detailUrl}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      ) : (
         <div className="text-center py-10 text-gray-500">
           No has subido ningún producto todavía.
           <Link href="/upload" className="text-primary hover:underline ml-2">¡Sube el primero!</Link>
         </div>
       )}
    </div>
  );
} // <--- ASEGÚRATE DE QUE ESTA LLAVE SEA LO ÚLTIMO EN EL ARCHIVO