// components/FilterBar.tsx - Versión con Tipos Dinámicos desde Supabase
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Importamos cliente Supabase

interface FilterBarProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  sortBy: string;
  onSortChange: (sortOption: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange
}) => {
  // Estados para controlar la apertura de los desplegables
  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // --- NUEVOS ESTADOS para tipos cargados de la DB ---
  const [dbTypes, setDbTypes] = useState<string[]>([]); // Guarda los tipos únicos
  const [typesLoading, setTypesLoading] = useState(true); // Estado de carga para los tipos
  const [typesError, setTypesError] = useState<string | null>(null); // Estado de error para los tipos

  // --- NUEVO useEffect para cargar los tipos desde Supabase ---
  useEffect(() => {
    const fetchTypes = async () => {
      setTypesLoading(true);
      setTypesError(null);
      try {
        // Seleccionamos solo la columna 'type' de todos los productos
        const { data, error } = await supabase
          .from('products')
          .select('type'); // Solo necesitamos la columna type

        if (error) throw error;

        if (data) {
          // Procesamos los datos para obtener tipos únicos y no nulos
          const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))] as string[];
          uniqueTypes.sort(); // Ordenamos alfabéticamente
          setDbTypes(uniqueTypes); // Guardamos los tipos únicos en el estado
          console.log("Tipos cargados desde DB:", uniqueTypes);
        } else {
           setDbTypes([]); // Si no hay datos, lista vacía
        }
      } catch (e: any) {
        console.error("Error fetching product types:", e);
        setTypesError("Could not load product types.");
        setDbTypes([]);
      } finally {
        setTypesLoading(false);
      }
    };

    fetchTypes(); // Llamamos a la función al montar el componente
  }, []); // Array vacío para que se ejecute solo una vez

  // --- Las funciones handler (handleTypeClick, clearTypeFilter, handleSortClick, getSortLabel) se mantienen igual ---
  const handleTypeClick = (type: string) => {
    const newSelectedType = selectedType === type ? null : type;
    onTypeChange(newSelectedType);
    setBusinessTypeOpen(false);
  };

  const clearTypeFilter = () => {
    onTypeChange(null);
    setBusinessTypeOpen(false);
  };

  const handleSortClick = (sortOption: string) => {
    onSortChange(sortOption);
    setSortOpen(false);
  };

  const getSortLabel = (sortKey: string): string => {
     switch (sortKey) {
       case 'popular': return 'Popular';
       case 'newest': return 'Newest';
       case 'price-asc': return 'Price: Low to High';
       case 'price-desc': return 'Price: High to Low';
       default: return 'Popular';
     }
   };

  // --- JSX Modificado para usar dbTypes ---
  return (
    <div className="sticky top-[60px] bg-white shadow-sm z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filters */}
          <div className="flex items-center space-x-4">

            {/* Business Types Dropdown (Ahora usa dbTypes) */}
            <div className="relative">
              <button
                onClick={() => setBusinessTypeOpen(!businessTypeOpen)}
                className="flex items-center px-4 py-2 border border-gray-200 rounded-button whitespace-nowrap hover:bg-gray-50 transition"
                disabled={typesLoading || !!typesError} // Deshabilitar si carga o hay error
              >
                <span>{selectedType ? `Type: ${selectedType}` : 'Business Types'}</span>
                <i className="ri-arrow-down-s-line ml-2"></i>
              </button>
              {businessTypeOpen && (
                <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                  {typesLoading ? (
                    <p className="p-2 text-sm text-gray-500">Loading types...</p>
                  ) : typesError ? (
                    <p className="p-2 text-sm text-red-500">{typesError}</p>
                  ) : dbTypes.length === 0 ? (
                    <p className="p-2 text-sm text-gray-500">No types available.</p>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {/* Mapeamos sobre los tipos cargados de la DB */}
                      {dbTypes.map((type) => (
                        <li key={type}>
                          <button
                            onClick={() => handleTypeClick(type)}
                            className={`block w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 ${
                              selectedType === type ? 'bg-blue-100 font-semibold text-primary' : ''
                            }`}
                          >
                            {type} {/* Muestra el tipo de la DB */}
                          </button>
                        </li>
                      ))}
                      {/* Botón Clear Filter (igual que antes) */}
                      {selectedType && (
                           <li key="clear-filter">
                             <button
                               onClick={clearTypeFilter}
                               className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 rounded mt-1"
                             >
                               Clear Filter
                             </button>
                           </li>
                         )}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Sort by Dropdown (Sin cambios en su lógica interna) */}
            <div className="relative">
               <button
                 onClick={() => setSortOpen(!sortOpen)}
                 className="flex items-center px-4 py-2 border border-gray-200 rounded-button whitespace-nowrap hover:bg-gray-50 transition"
               >
                 <span>Sort by: {getSortLabel(sortBy)}</span>
                 <i className="ri-arrow-down-s-line ml-2"></i>
               </button>
               {sortOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                    <ul className="text-sm">
                      <li key="popular"><button onClick={() => handleSortClick('popular')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'popular' ? 'font-semibold text-primary' : ''}`}>Popular</button></li>
                      <li key="newest"><button onClick={() => handleSortClick('newest')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'newest' ? 'font-semibold text-primary' : ''}`}>Newest</button></li>
                      <li key="price-asc"><button onClick={() => handleSortClick('price-asc')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'price-asc' ? 'font-semibold text-primary' : ''}`}>Price: Low to High</button></li>
                      <li key="price-desc"><button onClick={() => handleSortClick('price-desc')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'price-desc' ? 'font-semibold text-primary' : ''}`}>Price: High to Low</button></li>
                    </ul>
                  </div>
                )}
             </div>

          </div>

          {/* Tags (sin cambios) */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200 transition">#StartupPlans</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200 transition">#ExcelTemplates</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterBar;