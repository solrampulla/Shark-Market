import React from 'react';
import type { Metadata } from 'next';

// Componentes de UI
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

// --- INICIO DE LA CORRECCIÓN ---
// Importamos la conexión a la BD, los tipos necesarios, Y el propio 'admin'
import { adminDb } from '@/lib/firebaseAdmin';
import { type Product } from '@/types';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin'; // <-- ¡LA LÍNEA QUE FALTABA!
// --- FIN DE LA CORRECCIÓN ---

export const metadata: Metadata = {
  title: 'Shark Market | Tu Marketplace de Know-How Empresarial',
  description: 'Compra y vende planes de negocio, modelos financieros y estrategias creadas por expertos.',
};

// Esta función ahora obtiene los datos por sí misma
async function getHomepageProducts(): Promise<Product[]> {
  try {
    const query = adminDb.collection('products')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(4);
      
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.log("La consulta para la homepage no devolvió productos.");
      return [];
    }
    
    const products = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
            updatedAt: (data.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
        } as Product;
    });

    return products;

  } catch (error) {
    console.error("Error crítico obteniendo productos para la homepage:", error);
    return [];
  }
}

export default async function HomePage() {
  
  const featuredProducts = await getHomepageProducts();

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