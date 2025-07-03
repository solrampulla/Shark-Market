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
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const stepsToShow = activeTab === 'buyer' ? buyerSteps : sellerSteps;
  const activeTabStyle = "bg-orange-500 text-white";
  const inactiveTabStyle = "bg-slate-200 text-slate-700 hover:bg-slate-300";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-bold text-zinc-900 mb-4">
            Cómo Funciona
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Una plataforma diseñada tanto para emprendedores que buscan herramientas como para expertos que desean monetizar su conocimiento.
          </p>
        </div>
        
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stepsToShow.map((step, index) => (
            <div key={index}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <i className={`${step.icon} text-4xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          {activeTab === 'buyer' && (
            <Link href="/search" className="px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors duration-300">
              Explorar Herramientas
            </Link>
          )}
          {/* --- INICIO DE LA CORRECCIÓN --- */}
          {activeTab === 'seller' && (
            <Link href="/upload" className="px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors duration-300">
              Empezar a Vender
            </Link>
          )}
          {/* --- FIN DE LA CORRECCIÓN --- */}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;