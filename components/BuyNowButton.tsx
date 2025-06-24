// --- ARCHIVO FINAL Y CORREGIDO: components/BuyNowButton.tsx ---
// CORRECCIÓN: Se actualiza la importación para apuntar a la nueva acción de órdenes.
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; 
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'; 
import { toast } from 'sonner';

// ---> CORRECCIÓN: Apuntamos al nuevo archivo 'order.actions.ts'
import { createOrderAction } from '@/app/actions/order.actions';
import { getStripe } from '@/lib/stripe-loader';

interface BuyNowButtonProps {
  productId: string;
  price: number; 
  productName: string;
  productDescription: string;
  currency: string; 
}

export function BuyNowButton({ 
    productId, price, productName, productDescription, currency 
}: BuyNowButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false); 
    });
    return () => unsubscribe();
  }, []); 

  const handleBuyNow = async () => {
    if (!firebaseUser) {
      toast.error("Error: Debes iniciar sesión para comprar.");
      return;
    }

    setIsSubmitting(true);
    toast.info("Creando tu orden segura...");

    try {
      const result = await createOrderAction(
        firebaseUser.uid, productId, productName, price, currency 
      );

      if (result.success && result.sessionId) {
        const stripe = await getStripe();
        if (!stripe) throw new Error("No se pudo conectar con Stripe.");

        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        });

        if (error) {
          console.error("Error al redirigir a Stripe:", error);
          toast.error(error.message || "No se pudo redirigir a la página de pago.");
          setIsSubmitting(false);
        }
      } else {
        toast.error(result.error || 'No se pudo procesar la orden.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('[BuyNowButton] Error en el flujo de compra:', error);
      toast.error(error.message || "Ocurrió un error inesperado."); 
      setIsSubmitting(false);
    } 
  };
  
  const baseButtonStyle = "w-full inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent-hover transition-colors duration-300";
  const disabledButtonStyle = "disabled:bg-slate-400 disabled:cursor-not-allowed";

  if (authLoading) { 
    return <button disabled className={`${baseButtonStyle} ${disabledButtonStyle}`}>Verificando...</button>;
  }
  
  if (!firebaseUser) { 
    return <button onClick={() => router.push(`/login?redirect=/product/${productId}`)} className={baseButtonStyle}>Inicia sesión para comprar</button>;
  }

  return (
    <button onClick={handleBuyNow} disabled={isSubmitting} className={`${baseButtonStyle} ${disabledButtonStyle}`}>
      {isSubmitting ? 'Procesando Pedido...' : `Comprar Ahora por $${price.toFixed(2)}`}
    </button>
  );
}