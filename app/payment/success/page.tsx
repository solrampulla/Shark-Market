// --- ARCHIVO FINAL Y CORREGIDO ---
'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ========================================================================
// ---> INICIO: Contenido del Cliente
// Este componente contiene la lógica que usa useSearchParams
// ========================================================================
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (sessionId && orderId) {
      console.log("Pago exitoso (desde el cliente). Session ID:", sessionId, "Order ID:", orderId);
      // Aquí podrías querer hacer una llamada a una acción para verificar el estado del pedido
      // o simplemente mostrar un mensaje de éxito y confiar en el webhook para actualizar el pedido.
      // Por ahora, solo mostraremos un mensaje.
    }
  }, [sessionId, orderId]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
      <i className="ri-checkbox-circle-fill text-6xl text-green-500 mb-6"></i>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">¡Pago Exitoso!</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-2">
        Gracias por tu compra. Tu pedido <strong className="text-slate-700 dark:text-slate-100">{orderId || '...'}</strong> está siendo procesado.
      </p>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Recibirás acceso a tu producto en breve. Revisa también tu correo electrónico.
      </p>
      <Link href="/my-purchases" className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition">
        Ver Mis Compras
      </Link>
      <Link href="/" className="ml-4 inline-block text-primary dark:text-sky-400 font-semibold px-6 py-3 rounded-md hover:underline">
        Volver al Inicio
      </Link>
    </div>
  );
}

// ========================================================================
// ---> INICIO: Componente Principal de la Página
// Este componente ahora envuelve el contenido del cliente en un Suspense.
// ========================================================================
export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <Suspense fallback={<div className="text-slate-500">Cargando confirmación...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}