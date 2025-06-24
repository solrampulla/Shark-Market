// --- FILE: components/HowItWorksSection.tsx ---
// COMPLETELY REFACTORED with Tabs

'use client';

import { useState } from 'react';
import Link from 'next/link';

// Definimos el contenido de los pasos fuera del componente para mayor limpieza.
const buyerSteps = [
  {
    icon: 'ri-search-line',
    title: 'Descubre',
    description: 'Explora nuestro catálogo o usa la búsqueda para encontrar la herramienta exacta que necesitas.',
  },
  {
    icon: 'ri-secure-payment-line',
    title: 'Adquiere',
    description: 'Realiza tu compra de forma segura a través de nuestra pasarela de pago con Stripe.',
  },
  {
    icon: 'ri-download-cloud-2-line',
    title: 'Implementa',
    description: 'Descarga tus archivos al instante y aplícalos para acelerar el crecimiento de tu negocio.',
  }
];

const sellerSteps = [
  {
    icon: 'ri-file-list-3-line',
    title: 'Crea',
    description: 'Convierte tu experiencia de negocio en plantillas de valor.',
  },
  {
    icon: 'ri-price-tag-3-line',
    title: 'Ponle Precio',
    description: 'Define un precio justo basado en el valor que aportas.',
  },
  {
    icon: 'ri-money-dollar-circle-line',
    title: 'Gana Dinero',
    description: 'Recibe ingresos por compartir tu conocimiento experto.',
  }
];


const HowItWorksSection = () => {
  // ---> NUEVO: Estado para controlar la pestaña activa. Por defecto, 'buyer'.
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');

  // Determinamos qué contenido mostrar basado en la pestaña activa.
  const stepsToShow = activeTab === 'buyer' ? buyerSteps : sellerSteps;

  // Estilos para las pestañas
  const activeTabStyle = "bg-accent text-white";
  const inactiveTabStyle = "bg-slate-200 text-slate-700 hover:bg-slate-300";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          {/* ---> CAMBIO: Título actualizado con la nueva fuente y traducción. */}
          <h2 className="font-serif text-4xl font-bold text-text-DEFAULT mb-4">
            Cómo Funciona
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Una plataforma diseñada tanto para emprendedores que buscan herramientas como para expertos que desean monetizar su conocimiento.
          </p>
        </div>
        
        {/* ---> NUEVO: Selector de pestañas */}
        <div className="flex justify-center gap-x-2 sm:gap-x-4 mb-10">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-6 py-3 font-semibold rounded-full transition-colors duration-200 ${activeTab === 'buyer' ? activeTabStyle : inactiveTabStyle}`}
          >
            Para Compradores
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-6 py-3 font-semibold rounded-full transition-colors duration-200 ${activeTab === 'seller' ? activeTabStyle : inactiveTabStyle}`}
          >
            Para Vendedores
          </button>
        </div>

        {/* ---> CAMBIO: La parrilla ahora es dinámica y renderiza el contenido del estado activo. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stepsToShow.map((step, index) => (
            <div key={index}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <i className={`${step.icon} text-4xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-text-DEFAULT mb-2">{step.title}</h3>
              <p className="text-text-light">{step.description}</p>
            </div>
          ))}
        </div>

        {/* ---> NUEVO: Botón de Llamada a la Acción Condicional */}
        <div className="mt-12 text-center">
          {activeTab === 'buyer' && (
            <Link href="/search" className="px-8 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent-hover transition-colors duration-300">
              Explorar Plantillas
            </Link>
          )}
          {activeTab === 'seller' && (
            <Link href="/register" className="px-8 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent-hover transition-colors duration-300">
              Empezar a Vender
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;