// app/page.tsx
import React from 'react';
import type { Metadata } from 'next';

// Imports de Componentes
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

// Importaciones de Acciones y Tipos
import { getFilteredProductsAction } from '@/app/actions/product.actions';
import { type Product } from '@/types';

// Metadatos (sin cambios)
export const metadata: Metadata = {
  title: 'Shark Market | Tu Marketplace de Know-How Empresarial',
  description: 'Compra y vende planes de negocio, modelos financieros y estrategias creadas por expertos.',
};

export default async function HomePage() {
  
  console.log("--- [HomePage] Iniciando renderizado del servidor... ---");
  const productResult = await getFilteredProductsAction({ sortBy: 'newest' });
  console.log("--- [HomePage] Resultado recibido de la acción:", JSON.stringify(productResult, null, 2));

  let featuredProducts: Product[] = []; 

  if (productResult.success && productResult.data) {
    featuredProducts = productResult.data.slice(0, 4);
    console.log(`--- [HomePage] ÉXITO: Se procesaron ${featuredProducts.length} productos.`);
  } else {
    console.error("--- [HomePage] ERROR: La acción no tuvo éxito.");
    if (productResult.error) {
      console.error("--- [HomePage] Mensaje de error:", productResult.error);
    }
  }

  return (
    <>
      <HeroSection />
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedSection
            products={featuredProducts}
            isLoading={false}
          />
        </div>
      </section>
      <section className="py-24 bg-white"><HowItWorksSection /></section>
      <section className="py-24 bg-background"><TestimonialsSection /></section>
      <section className="py-24 bg-white"><CtaSection /></section>
    </>
  );
}