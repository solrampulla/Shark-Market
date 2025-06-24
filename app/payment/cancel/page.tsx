// app/payment/cancel/page.tsx
import React from 'react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
        <i className="ri-close-circle-fill text-6xl text-red-500 mb-6"></i>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Pago Cancelado</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Tu proceso de pago fue cancelado. No se ha realizado ningún cargo.
        </p>
        <Link href="/" legacyBehavior>
          <a className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition">
            Volver al Inicio
          </a>
        </Link>
         {/* Podrías añadir un enlace para reintentar el pago del mismo producto/orden si tienes esa lógica */}
      </div>
    </div>
  );
}