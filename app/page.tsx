// --- ARCHIVO FINAL Y DEFINITIVO: app/page.tsx ---
// CORRECCIÓN: Se reestructura para ser un Server Component que carga datos
// y los pasa a un Client Component, eliminando el error de raíz.
import React, { Suspense } from 'react';
import type { Metadata } from 'next';

// Imports de Componentes de UI (no cambian)
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

// Importaciones de Acciones y Tipos
import { getFilteredProductsAction } from '@/app/actions/product.actions';
import { type Product } from '@/types';


// Metadatos para la página principal (ya lo teníamos)
export const metadata: Metadata = {
  title: 'Shark Market | Tu Marketplace de Know-How Empresarial',
  description: 'Compra y vende planes de negocio, modelos financieros y estrategias creadas por expertos.',
};


// La página ahora es un Server Component que carga los datos
export default async function HomePage() {

  // Cargamos los productos directamente en el servidor
  const productResult = await getFilteredProductsAction({ sortBy: 'newest' });
  
  // Extraemos solo los 4 primeros productos, o un array vacío si falla
  const featuredProducts = (productResult.success && productResult.data) 
    ? productResult.data.slice(0, 4) 
    : [];

  return (
    <>
      <HeroSection />
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pasamos los productos ya cargados al componente que los muestra */}
          <FeaturedSection
            products={featuredProducts}
            isLoading={false} // La carga ya se hizo en el servidor
          />
        </div>
      </section>
      <section className="py-24 bg-white"><HowItWorksSection /></section>
      <section className="py-24 bg-background"><TestimonialsSection /></section>
      <section className="py-24 bg-white"><CtaSection /></section>
    </>
  );
}