// ========================================================================
// ARCHIVO CORREGIDO: components/FilterBar.tsx
// CORRECCIÓN: Se añade la propiedad 'defaultOptionLabel' que faltaba
// en el último FilterSelect para cumplir con los requisitos de TypeScript.
// ========================================================================
'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { CATEGORIES, INDUSTRIES, PRODUCT_TYPES, SORT_OPTIONS } from '@/lib/constants';
import FilterSelect from './search/FilterSelect';
import { Search } from 'lucide-react';

interface Filters {
  q?: string;
  category?: string;
  industry?: string;
  type?: string;
  sortBy?: string;
}

interface FilterBarProps {
  initialFilters: Filters; 
  onFiltersUpdate: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ initialFilters, onFiltersUpdate }) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 500);

  useEffect(() => {
    onFiltersUpdate(debouncedFilters);
  }, [debouncedFilters, onFiltersUpdate]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="sticky top-[60px] bg-white z-30 border-b border-slate-200 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-3">
          
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="q"
              id="q"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Buscar por título..."
              value={filters.q || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center gap-x-3 flex-wrap gap-y-2">
            <FilterSelect
              label="Categoría"
              name="category"
              value={filters.category || 'all'}
              onChange={handleSelectChange}
              options={CATEGORIES}
              defaultOptionLabel="Todas las Categorías"
            />
            <div className="hidden md:block">
              <FilterSelect
                label="Industria"
                name="industry"
                value={filters.industry || 'all'}
                onChange={handleSelectChange}
                options={INDUSTRIES}
                defaultOptionLabel="Todas las Industrias"
              />
            </div>
            <div className="hidden md:block">
              <FilterSelect
                label="Tipo"
                name="type"
                value={filters.type || 'all'}
                onChange={handleSelectChange}
                options={PRODUCT_TYPES}
                defaultOptionLabel="Todos los Tipos"
              />
            </div>
          </div>
          
          <div> 
            {/* --- LA LÍNEA CORREGIDA ESTÁ AQUÍ --- */}
            <FilterSelect
              label="Ordenar por"
              name="sortBy"
              value={filters.sortBy || 'newest'}
              onChange={handleSelectChange}
              options={SORT_OPTIONS}
              defaultOptionLabel="" // Añadimos la propiedad requerida, aunque esté vacía.
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;