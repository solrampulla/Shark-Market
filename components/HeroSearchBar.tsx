// Contenido CORREGIDO para: components/HeroSearchBar.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 1. CORRECCIÓN: Importamos la nueva constante 'CATEGORIES'
import { CATEGORIES } from '@/lib/constants';

const HeroSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) {
      // Usamos el 'value' de la categoría para la URL, que es más limpio
      params.set('category', category);
    }
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex items-center bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden pr-2"
    >
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-full pl-4 pr-8 py-4 text-sm text-slate-600 bg-white border-r border-slate-200 focus:outline-none appearance-none cursor-pointer"
        >
          {/* 2. CORRECCIÓN: Ajustamos el menú desplegable al nuevo formato */}
          <option value="">Todas las Categorías</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
            {/* Puedes usar un ícono SVG aquí si quieres para no depender de Remixicon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="¿Qué necesitas para tu negocio?"
        className="w-full h-full px-4 text-slate-800 placeholder-slate-400 focus:outline-none"
      />
      <button 
        type="submit" 
        className="bg-blue-600 rounded-md p-3 text-white hover:bg-blue-700 transition-colors"
        aria-label="Buscar"
      >
        {/* Usamos un ícono SVG para no depender de librerías externas */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
};

export default HeroSearchBar;