// --- FILE: components/FeaturedSection.tsx ---
// FINAL VERSION v5 (Client-side fetch from SUPABASE, filtering, sorting)
'use client'; // Marcamos como Componente de Cliente

import React, { useState, useEffect } from 'react'; // Hooks para estado y efectos
import Link from 'next/link';
import ProductCard from './ProductCard';
import { generateSlug, type Product } from '@/lib/sample-data'; // Importamos Interface y Función slug
import { supabase } from '@/lib/supabaseClient'; // <--- ¡IMPORTAMOS NUESTRO CLIENTE SUPABASE!

// Definimos las props que recibe (igual que antes)
interface FeaturedSectionProps {
  selectedType: string | null;
  sortBy: string;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ selectedType, sortBy }) => {
  // Estado para guardar TODOS los productos leídos de Supabase
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  // Estados para manejar la carga y errores
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para cargar los datos de Supabase UNA VEZ cuando el componente se monta
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // --- INICIO: Llamada a Supabase ---
        // Usamos el cliente 'supabase' que configuramos
        // .from('products') indica la tabla que queremos consultar
        // .select('*') indica que queremos todas las columnas
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*');
        // --- FIN: Llamada a Supabase ---

        if (dbError) {
          // Si Supabase devuelve un error, lo lanzamos para que lo capture el catch
          throw dbError;
        }

        // Si la data existe (puede ser null si la tabla está vacía), la guardamos
        setAllProducts(data || []);

      } catch (e: any) {
        console.error("Failed to fetch products from Supabase:", e);
        // Guardamos un mensaje de error más específico si es posible
        setError(`Failed to load products: ${e.message || 'Unknown error'}`);
        setAllProducts([]); // Vaciamos en caso de error
      } finally {
        setIsLoading(false); // Terminamos la carga
      }
    };

    fetchProducts(); // Ejecutamos la función al montar
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // --- Lógica de Filtrado y Ordenamiento (aplicada a los datos en 'allProducts') ---

  // 1. Filtrar basado en selectedType
  const filteredProducts = selectedType
    ? allProducts.filter(product => product.type === selectedType)
    : allProducts;

  // 2. Ordenar la lista filtrada basado en sortBy
  // Creamos una copia para no mutar el estado directamente al ordenar
  let sortedAndFilteredProducts = [...filteredProducts];
  switch (sortBy) {
    case 'price-asc':
      sortedAndFilteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedAndFilteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest': // Usamos título como fallback
      sortedAndFilteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'popular': // Sin orden específico por ahora
    default:
      break;
  }
  // --- Fin Filtrado y Ordenamiento ---


  // --- Lógica de Renderizado (similar a antes, pero usa los datos de Supabase) ---
  if (isLoading) {
    return (
       <section className="py-12 bg-white">
         <div className="container mx-auto px-4 text-center text-gray-500">
           Loading products from database... {/* Mensaje actualizado */}
         </div>
       </section>
    );
  }

  if (error) {
     return (
       <section className="py-12 bg-white">
         <div className="container mx-auto px-4 text-center text-red-500">
           Error: {error} {/* Muestra el mensaje de error */}
         </div>
       </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Business Plans & Templates</h2>
          <Link href="/templates" className="text-primary font-medium hover:underline flex-shrink-0">
            View All
          </Link>
        </div>

        {/* Usamos la lista final 'sortedAndFilteredProducts' */}
        {sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredProducts.map((product) => { // No necesitamos 'index' si usamos slug como key
              // Generamos slug y URL (igual que antes)
              const slug = generateSlug(product.title);
              const detailUrl = `/product/${slug}`;

              return (
                <ProductCard
                  key={slug} // Usamos slug como key
                  imageUrl={product.imageUrl || '/placeholder.png'} // Añadimos fallback por si imageUrl es null
                  title={product.title}
                  price={product.price}
                  type={product.type}
                  typeIcon={product.typeIcon || 'ri-file-line'} // Fallback para icono
                  buyLink="#" // Placeholder
                  altText={`${product.title} image`}
                  detailUrl={detailUrl}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
             {/* Mensaje si no hay productos o el filtro no devuelve resultados */}
             {allProducts.length === 0 ? 'No products available yet.' : 'No products found matching the selected criteria.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;