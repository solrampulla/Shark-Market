'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, Edit, ArrowLeft } from 'lucide-react';

// Importamos lo necesario para la autenticación
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

import CreateProductForm from '@/components/upload/CreateProductForm';

export default function UploadPageClient() {
  const [uploadType, setUploadType] = useState<'simple' | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // El componente SelectionCard ahora vive dentro del componente principal para evitar errores
  const SelectionCard = ({ href, icon: Icon, title, description, onClick }: any) => (
      <div
        onClick={onClick}
        className="bg-white rounded-lg border border-slate-200 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full"
      >
        <div className="flex justify-center items-center mx-auto bg-accent/10 rounded-full w-16 h-16 mb-4">
          <Icon className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoadingAuth) {
    return <div className="text-center p-8"><p className="animate-pulse text-slate-500">Verificando sesión...</p></div>;
  }

  if (!currentUser) {
    return (
      <div className="text-center py-16 px-6 border-2 border-dashed border-slate-300 rounded-lg bg-white max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800">Acceso Restringido</h2>
        <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">Debes iniciar sesión para poder subir productos.</p>
        <Link href="/login" className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent-hover">
            Iniciar Sesión
        </Link>
      </div>
    );
  }

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
          <div onClick={() => setUploadType('simple')} role="button" tabIndex={0} className="cursor-pointer">
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
          <CreateProductForm currentUser={currentUser} />
        </div>
      </div>
    );
  }

  return null;
}