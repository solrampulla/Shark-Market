// --- components/HeroSearchBar.tsx (VERSIÓN REFINADA) ---
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants'; // Asumo que este archivo ya existe

const HeroSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    // --- ESTILOS REFINADOS para consistencia de marca ---
    <form 
      onSubmit={handleSubmit} 
      className="flex w-full items-center overflow-hidden rounded-lg border border-zinc-300 bg-white pr-2 shadow-lg"
    >
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          // --- ESTILOS REFINADOS ---
          className="h-full cursor-pointer appearance-none border-r border-zinc-300 bg-white py-4 pl-4 pr-8 text-sm text-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
        >
          <option value="">Todas las Categorías</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="¿Qué necesitas para tu negocio?"
        // --- ESTILOS REFINADOS ---
        className="h-full w-full px-4 text-zinc-800 placeholder-zinc-400 focus:outline-none"
      />
      <button 
        type="submit" 
        // --- BOTÓN DE ACCIÓN CON NUESTRO COLOR DE MARCA (NARANJA) ---
        className="rounded-md bg-orange-500 p-3 text-white transition-colors hover:bg-orange-600"
        aria-label="Buscar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
};

export default HeroSearchBar;