'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SHARK_MARKET_CATEGORIES } from '@/lib/product-categories';
import { SORT_OPTIONS } from '@/lib/constants';
import FilterSelect from './search/FilterSelect';
import { Search } from 'lucide-react';

interface Filters {
  q?: string;
  category?: string;
  sortBy?: string;
}

interface FilterBarProps {
  initialFilters: Filters; 
  onFiltersUpdate: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ initialFilters }) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const router = useRouter();

  // Esta función ahora solo construye la URL y navega.
  // El Server Component se encargará de volver a cargar los datos.
  const handleFilterChange = (newFilter: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilter };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    if (updatedFilters.q) params.set('q', updatedFilters.q);
    if (updatedFilters.category && updatedFilters.category !== 'all') params.set('category', updatedFilters.category);
    if (updatedFilters.sortBy) params.set('sortBy', updatedFilters.sortBy);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-[60px] z-30 border-b border-slate-200 bg-white/80 py-3 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          
          <form className="relative flex-grow sm:flex-grow-0 sm:w-64" onSubmit={(e) => { e.preventDefault(); handleFilterChange({}); }}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="q"
              className="block w-full rounded-md border-slate-300 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
              placeholder="Buscar por título..."
              defaultValue={filters.q || ''}
              // Se actualiza al enviar el formulario
              onBlur={(e) => setFilters(prev => ({...prev, q: e.target.value}))}
            />
          </form>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <FilterSelect
              label="Categoría"
              name="category"
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              options={SHARK_MARKET_CATEGORIES}
              defaultOptionLabel="Todas las Categorías"
            />
          </div>
          
          <div> 
            <FilterSelect
              label="Ordenar por"
              name="sortBy"
              value={filters.sortBy || 'newest'}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              options={SORT_OPTIONS}
              defaultOptionLabel=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;