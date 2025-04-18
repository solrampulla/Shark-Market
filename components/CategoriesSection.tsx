// --- FILE: components/CategoriesSection.tsx ---

'use client'; // Necesario para useRef y event handlers

import React, { useRef } from 'react';

// Componente interno para items de categoría
const CategoryItem = ({ icon, title, bgColor, textColor }: { icon: string, title: string, bgColor: string, textColor: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition cursor-pointer flex-shrink-0 w-60 md:w-64">
    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
      <i className={`${icon} text-2xl`}></i> {/* Ajusta tamaño icono si es necesario */}
    </div>
    <h3 className="font-medium text-gray-900">{title}</h3>
  </div>
);

const CategoriesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Ajusta la cantidad de scroll
        behavior: 'smooth'
      });
    }
  };

  const categories = [
    { icon: 'ri-store-2-line', title: 'Retail', bgColor: 'bg-blue-100', textColor: 'text-primary' },
    { icon: 'ri-restaurant-line', title: 'Food & Beverage', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { icon: 'ri-service-line', title: 'Services', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { icon: 'ri-shopping-cart-line', title: 'E-commerce', bgColor: 'bg-red-100', textColor: 'text-red-600' },
    { icon: 'ri-building-line', title: 'Real Estate', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    // Añade más categorías si existen
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        </div>
        {/* Contenedor relativo para posicionar el botón */}
        <div className="relative">
          {/* Contenedor scrollable */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide gap-4 -mx-4 px-4" // Added negative margin and padding to allow edge cards to reach edge before scrollbar space
          >
            {categories.map((cat, index) => (
              <CategoryItem key={index} {...cat} />
            ))}
          </div>
          {/* Botón de scroll (opcionalmente ocultar en pantallas grandes si no hay overflow) */}
          {/* Consider adding logic to hide button if not scrollable */}
          <button
            onClick={scrollRight}
            aria-label="Scroll categories right"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1 md:mr-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 z-10 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;