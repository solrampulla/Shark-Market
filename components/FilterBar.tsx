// --- FILE: components/FilterBar.tsx ---
// CORRECTED v3 (Added keys to sort list items)

'use client';

import React, { useState } from 'react';

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
  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const availableTypes = ["Business Plan", "Excel Template", "Marketing Plan"];

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

  return (
    <div className="sticky top-[60px] bg-white shadow-sm z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filters */}
          <div className="flex items-center space-x-4">

            {/* Business Types Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBusinessTypeOpen(!businessTypeOpen)}
                className="flex items-center px-4 py-2 border border-gray-200 rounded-button whitespace-nowrap hover:bg-gray-50 transition"
              >
                <span>{selectedType ? `Type: ${selectedType}` : 'Business Types'}</span>
                <i className="ri-arrow-down-s-line ml-2"></i>
              </button>
              {businessTypeOpen && (
                <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                  <ul className="space-y-1 text-sm">
                    {availableTypes.map((type) => (
                      // La key aquí estaba bien porque viene de un map
                      <li key={type}>
                        <button
                          onClick={() => handleTypeClick(type)}
                          className={`block w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 ${
                            selectedType === type ? 'bg-blue-100 font-semibold text-primary' : ''
                          }`}
                        >
                          {type}
                        </button>
                      </li>
                    ))}
                    {selectedType && (
                       // Este li es único condicionalmente, no necesita key estrictamente, pero se la ponemos por consistencia
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
                </div>
              )}
            </div>

            {/* Sort by Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center px-4 py-2 border border-gray-200 rounded-button whitespace-nowrap hover:bg-gray-50 transition"
              >
                <span>Sort by: {getSortLabel(sortBy)}</span>
                <i className="ri-arrow-down-s-line ml-2"></i>
              </button>
              {sortOpen && (
                 <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2"> {/* Ajustado ancho */}
                  <ul className="text-sm">
                    {/* --- CORRECCIÓN: Añadida 'key' prop única a cada 'li' --- */}
                    <li key="popular"><button onClick={() => handleSortClick('popular')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'popular' ? 'font-semibold text-primary' : ''}`}>Popular</button></li>
                    <li key="newest"><button onClick={() => handleSortClick('newest')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'newest' ? 'font-semibold text-primary' : ''}`}>Newest</button></li>
                    <li key="price-asc"><button onClick={() => handleSortClick('price-asc')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'price-asc' ? 'font-semibold text-primary' : ''}`}>Price: Low to High</button></li>
                    <li key="price-desc"><button onClick={() => handleSortClick('price-desc')} className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded ${sortBy === 'price-desc' ? 'font-semibold text-primary' : ''}`}>Price: High to Low</button></li>
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Tags */}
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