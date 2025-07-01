import React from 'react';
import type { Metadata } from 'next';

import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

import { getFilteredProductsAction } from '@/app/actions/product.actions';
import { type Product } from '@/types';

export const metadata: Metadata = {
  title: 'Shark Market | Tu Marketplace de Know-How Empresarial',
  description: 'Compra y vende planes de negocio, modelos financieros y estrategias creadas por expertos.',
};

export default async function HomePage() {
  
  const productResult = await getFilteredProductsAction({ sortBy: 'newest' });
  
  const featuredProducts: Product[] = (productResult.success && productResult.data) 
    ? productResult.data.slice(0, 4) 
    : [];

  return (
    <>
      <HeroSection />
      {/* El FeaturedSection solo se mostrará si tiene productos */}
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