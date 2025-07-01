// --- ARCHIVO CORREGIDO: app/page.tsx (con tipo explícito para TypeScript) ---
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
import { type Product } from '@/types'; // <--- Ya importas el tipo aquí

// Metadatos (sin cambios)
export const metadata: Metadata = {
  title: 'Shark Market | Tu Marketplace de Know-How Empresarial',
  description: 'Compra y vende planes de negocio, modelos financieros y estrategias creadas por expertos.',
};

export default async function HomePage() {
  
  console.log("--- [HomePage] Iniciando renderizado del servidor. ---");

  // Añadimos logs antes y después de llamar a la acción
  console.log("--- [HomePage] Llamando a getFilteredProductsAction... ---");
  const productResult = await getFilteredProductsAction({ sortBy: 'newest' });
  
  // ¡EL LOG MÁS IMPORTANTE! Mostramos el resultado completo de la acción
  console.log("--- [HomePage] Resultado recibido de la acción:", JSON.stringify(productResult, null, 2));

  // LA CORRECCIÓN ESTÁ EN ESTA LÍNEA
  let featuredProducts: Product[] = []; // Especificamos que es un array de 'Product'

  // Verificamos el resultado y actuamos en consecuencia
  if (productResult.success && productResult.data) {
    featuredProducts = productResult.data.slice(0, 4);
    console.log(`--- [HomePage] ÉXITO: Se procesaron ${featuredProducts.length} productos destacados.`);
  } else {
    // Si la acción falló, lo registramos como un error
    console.error("--- [HomePage] ERROR: La acción getFilteredProductsAction no tuvo éxito o no devolvió datos.");
    if (productResult.error) {
      console.error("--- [HomePage] Mensaje de error de la acción:", productResult.error);
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
