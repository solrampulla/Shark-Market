// --- FILE: app/page.tsx ---
// UPDATED VERSION (Added state for sorting)

'use client';

import { useState } from 'react';

import FilterBar from "@/components/FilterBar";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BusinessModelsSection from "@/components/BusinessModelsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

export default function HomePage() {
  // Estado para el filtro por tipo
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // --- INICIO: Nuevo Estado para Ordenamiento ---
  // Guardaremos el criterio de ordenación actual.
  // Opciones posibles: 'popular', 'newest', 'price-asc', 'price-desc' (podemos definir más)
  // Empezamos ordenando por 'popular' (aunque aún no implementemos esa lógica exacta)
  const [sortBy, setSortBy] = useState<string>('popular');
  // 'sortBy' guarda el criterio actual.
  // 'setSortBy' es la función para cambiar el criterio.
  // --- FIN: Nuevo Estado para Ordenamiento ---

  return (
    <>
       {/* Pasamos también el estado de ordenación y su función a FilterBar */}
       <FilterBar
         selectedType={selectedType}
         onTypeChange={setSelectedType}
         sortBy={sortBy} // <-- Nueva prop pasada
         onSortChange={setSortBy} // <-- Nueva prop pasada
       />

       <HeroSection />

       {/* Pasamos también el estado de ordenación a FeaturedSection */}
       <FeaturedSection
         selectedType={selectedType}
         sortBy={sortBy} // <-- Nueva prop pasada
       />

       {/* Las otras secciones no cambian */}
       <CategoriesSection />
       <HowItWorksSection />
       <BusinessModelsSection />
       <TestimonialsSection />
       <CtaSection />
    </>
  );
}