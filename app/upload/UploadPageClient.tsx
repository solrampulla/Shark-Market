// --- NUEVO ARCHIVO: app/upload/UploadPageClient.tsx ---
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, Edit, ArrowLeft } from 'lucide-react';
import CreateProductForm from '@/components/upload/CreateProductForm';

export default function UploadPageClient() {
  const [uploadType, setUploadType] = useState<'simple' | null>(null);

  const SelectionCard = ({ href, icon: Icon, title, description, onClick }: any) => (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex justify-center items-center mx-auto bg-accent/10 rounded-full w-16 h-16 mb-4">
        <Icon className="w-8 h-8 text-accent" />
      </div>
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );

  if (!uploadType) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-800">
            Elige tu Camino
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            ¿Cómo quieres compartir tu conocimiento hoy?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div onClick={() => setUploadType('simple')} role="button" tabIndex={0}>
            <SelectionCard
              icon={UploadCloud}
              title="Producto Simple"
              description="Ideal para plantillas, checklists o documentos únicos. ¡Rápido y directo!"
            />
          </div>
          <Link href="/upload/assisted-creation">
            <SelectionCard
              icon={Edit}
              title="Creación Asistida"
              description="Perfecto para productos complejos como Planes de Negocio. Te guiaremos paso a paso."
            />
          </Link>
        </div>
      </div>
    );
  }

  if (uploadType === 'simple') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="relative text-center mb-10">
          <button 
            onClick={() => setUploadType(null)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-sm font-semibold text-slate-600 hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-800">
            Subir Producto Simple
          </h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-lg">
          <CreateProductForm />
        </div>
      </div>
    );
  }

  return null;
}