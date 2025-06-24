// components/header/CategoryDropdown.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { marketplaceCategories, type Category } from '@/lib/category-data';

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) { document.addEventListener("mousedown", handleClickOutside); }
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen]);

  // Cuando el mouse sale del menú principal, cerramos todo.
  const handleMouseLeave = () => {
    setIsOpen(false);
    setActiveCategory(null);
  }

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave} // <- Añadido para cerrar al salir del área
    >
      <button
        className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-sky-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        aria-haspopup="true" aria-expanded={isOpen}
      >
        <i className="ri-layout-grid-line"></i>
        <span>Categorías</span>
        <i className={`ri-arrow-down-s-line transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-md shadow-lg border dark:border-slate-700 z-50 flex"
          style={{ animation: 'fadeIn 0.2s ease-out' }} 
        >
          {/* Panel 1: Categorías Principales */}
          <div className="w-64 border-r dark:border-slate-700">
            <ul className="py-2">
              {marketplaceCategories.map((category) => (
                <li 
                  key={category.slug}
                  onMouseEnter={() => setActiveCategory(category)}
                >
                  <Link
                    href={`/search?category=${category.slug}`}
                    className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      {category.icon && <i className={`${category.icon} text-base`}></i>}
                      <span>{category.name}</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-slate-400"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel 2: Subcategorías */}
          <div className="w-64">
            {activeCategory ? (
              <ul className="py-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
                {activeCategory.subcategories.map((subcategory) => (
                  <li key={subcategory.slug}>
                    <Link
                      href={`/search?category=${activeCategory.slug}&type=${subcategory.slug}`}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="p-4 text-sm text-slate-400">
                    Pasa el mouse sobre una categoría para ver los tipos.
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}