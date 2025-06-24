// --- NUEVO ARCHIVO: app/upload/assisted-creation/page.tsx ---

import ProductCreationWizard from '@/components/upload/ProductCreationWizard';

export default function AssistedCreationPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-slate-800">
              Asistente de Creación de Productos
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Te guiaremos paso a paso para crear un producto de alto valor.
            </p>
          </div>
          
          {/* Este es el componente que contendrá toda la lógica del wizard */}
          <ProductCreationWizard />
        </div>
      </div>
    </div>
  );
}