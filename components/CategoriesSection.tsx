// components/CategoriesSection.tsx (MODIFICADO)
'use client'; 

import React, { useRef } from 'react';

// Props que el componente CategoriesSection puede recibir
interface CategoriesSectionProps {
  onCategorySelect?: (categoryTitle: string) => void; // Función opcional para manejar el clic
}

// Componente interno para items de categoría
const CategoryItem = ({ 
    icon, 
    title, 
    bgColor, 
    textColor,
    onClick 
}: { 
    icon: string; 
    title: string; 
    bgColor: string; 
    textColor: string;
    onClick: () => void; // Añadimos prop onClick
}) => (
  // MODIFICADO: Añadido div con onClick
  <div 
    onClick={onClick} // Llamar a onClick cuando se hace clic en el ítem
    className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition cursor-pointer flex-shrink-0 w-60 md:w-64 border dark:border-slate-700 hover:border-primary dark:hover:border-sky-500"
  >
    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
      <i className={`${icon} text-2xl`}></i>
    </div>
    <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
  </div>
);

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategorySelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const categories = [
    { icon: 'ri-store-2-line', title: 'Planes de Negocio', bgColor: 'bg-blue-100', textColor: 'text-primary' },
    { icon: 'ri-calculator-line', title: 'Modelos Financieros', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { icon: 'ri-megaphone-line', title: 'Estrategia de Marketing', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { icon: 'ri-bar-chart-grouped-line', title: 'Análisis de Mercado', bgColor: 'bg-red-100', textColor: 'text-red-600' },
    // Puedes añadir más categorías que definiste en app/page.tsx (availableCategories)
    // { icon: 'ri-building-line', title: 'Real Estate', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
  ];

  const handleCategoryClick = (categoryTitle: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryTitle);
    }
    console.log("Categoría seleccionada:", categoryTitle);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Navega por Categoría</h2>
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide gap-4 -mx-4 px-4"
          >
            {categories.map((cat, index) => (
              <CategoryItem 
                key={index} 
                {...cat} 
                onClick={() => handleCategoryClick(cat.title)} // Pasamos la función onClick
              />
            ))}
          </div>
          <button
            onClick={scrollRight}
            aria-label="Scroll categories right"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1 md:mr-0 w-10 h-10 bg-white dark:bg-slate-700 rounded-full shadow-md flex items-center justify-center text-gray-700 dark:text-slate-200 z-10 hover:bg-gray-100 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;