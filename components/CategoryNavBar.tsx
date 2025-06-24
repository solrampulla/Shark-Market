// --- ARCHIVO FINAL Y CORREGIDO: components/CategoryNavBar.tsx ---
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// ---> CORRECCIÓN 1: Importamos la constante con el nombre correcto.
import { CATEGORIES } from '@/lib/constants';

// ---> MEJORA UX: Añadimos una opción para "Todas" al principio de la lista.
const allCategories = [{ label: 'Todas las Categorías', value: 'all' }, ...CATEGORIES];

const CategoryNavBar = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <nav className="bg-white border-b border-t border-slate-200 sticky top-[60px] z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-x-2 sm:gap-x-4 overflow-x-auto py-3 whitespace-nowrap scrollbar-hide">
          {/* ---> CORRECCIÓN 2: Mapeamos sobre la nueva lista y usamos .value y .label */}
          {allCategories.map((category) => {
            // Un 'Link' está activo si la categoría en la URL coincide,
            // o si no hay categoría en la URL y estamos en el botón "all".
            const isActive = (currentCategory === category.value) || (!currentCategory && category.value === 'all');
            
            const baseStyle = "px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex-shrink-0";
            
            const activeStyle = "bg-accent text-white shadow-sm";
            const inactiveStyle = "bg-slate-100 text-slate-700 hover:bg-slate-200";

            return (
              <Link
                key={category.value}
                href={category.value === 'all' ? '/search' : `/search?category=${encodeURIComponent(category.value)}`}
                className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
              >
                {category.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavBar;