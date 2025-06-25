// --- ARCHIVO FINAL Y CORREGIDO ---

import type { Metadata } from 'next';
import { Suspense } from 'react'; // Importamos Suspense
import SearchPageClient from './SearchPageClient';

// Los metadatos ahora pueden vivir aquí sin problemas.
export const metadata: Metadata = {
  title: 'Explorar Productos | Shark Market',
  description: 'Busca y filtra entre cientos de plantillas y herramientas de negocio creadas por expertos.',
};

// Un componente simple para mostrar mientras carga el contenido principal.
// Mejora la experiencia de usuario.
function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4">
              <div className="w-full h-40 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// La página ahora es un Server Component limpio que usa Suspense.
export default function SearchPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}