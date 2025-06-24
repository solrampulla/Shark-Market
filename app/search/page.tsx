// --- ARCHIVO CORREGIDO: app/search/page.tsx ---

import type { Metadata } from 'next';
import SearchPageClient from './SearchPageClient'; // Importamos el nuevo componente

// Los metadatos ahora pueden vivir aquí sin problemas.
export const metadata: Metadata = {
  title: 'Explorar Productos | Shark Market',
  description: 'Busca y filtra entre cientos de plantillas y herramientas de negocio creadas por expertos.',
};

// La página ahora es un Server Component limpio.
export default function SearchPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
        <SearchPageClient />
    </div>
  );
}