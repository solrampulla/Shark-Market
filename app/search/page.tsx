import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';
import { adminDb } from '@/lib/firebaseAdmin';
import { type Product, type FilterCriteria } from '@/types';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

export const metadata: Metadata = {
  title: 'Explorar Productos | Shark Market',
  description: 'Busca y filtra entre cientos de plantillas y herramientas de negocio creadas por expertos.',
};

async function getProductsForSearch(searchParams: { [key: string]: string | string[] | undefined }) {
  const criteria: FilterCriteria = {
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : 'all',
    sortBy: typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'newest',
  };

  try {
    let query: admin.firestore.Query = adminDb.collection('products');
    query = query.where('approved', '==', true);

    if (criteria.category && criteria.category !== "all") {
      query = query.where('category', '==', criteria.category);
    }
    
    if (criteria.q) {
        const searchTerms = criteria.q.toLowerCase().split(' ').filter(term => term.length > 1);
        if (searchTerms.length > 0) query = query.where('searchableKeywords', 'array-contains-any', searchTerms);
    }
    
    if (criteria.sortBy === 'price_asc') {
      query = query.orderBy('price', 'asc');
    } else if (criteria.sortBy === 'price_desc') {
      query = query.orderBy('price', 'desc');
    } else {
      query = query.orderBy('createdAt', 'desc'); 
    }
    
    const snapshot = await query.get();
    if (snapshot.empty) return [];
    
    const products = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
            id: doc.id, ...data,
            createdAt: (data.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
            updatedAt: (data.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
        } as Product;
    });
    return products;
  } catch (error) {
    // --- INICIO DE LA CORRECCIÓN ---
    // Este log nos mostrará el error real en la consola de Vercel
    console.error("ERROR DEFINITIVO EN LA CONSULTA DE BÚSQUEDA:", error);
    // --- FIN DE LA CORRECCIÓN ---
    return []; 
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const initialProducts = await getProductsForSearch(searchParams);
  
  return (
    <div className="bg-slate-50 min-h-screen">
        {/* Mantenemos el título rojo para saber que estamos en la versión correcta */}
        <h1 className="text-center text-4xl font-bold text-red-500 p-10">
            ESTA ES LA VERSIÓN NUEVA DEL CÓDIGO
        </h1>
      <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
        <SearchPageClient 
          initialProducts={initialProducts} 
          key={JSON.stringify(searchParams)} 
        />
      </Suspense>
    </div>
  );
}