// --- ARCHIVO CORREGIDO: app/upload/page.tsx ---

import type { Metadata } from 'next';
import UploadPageClient from './UploadPageClient'; // Importamos el nuevo componente

// Los metadatos ahora pueden vivir aquí sin problemas
export const metadata: Metadata = {
  title: 'Vender en Founder Market',
  description: 'Comparte tu conocimiento con miles de emprendedores y genera una nueva fuente de ingresos.',
};

// La página ahora es un Server Component limpio que envuelve al componente de cliente
export default function UploadPage() {
  return (
    <div className="bg-slate-50 min-h-full">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <UploadPageClient />
      </div>
    </div>
  );
}