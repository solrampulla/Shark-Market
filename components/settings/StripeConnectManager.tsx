// --- NUEVO ARCHIVO: components/settings/StripeConnectManager.tsx ---
'use client';

import React, { useTransition } from 'react';
import { toast } from 'sonner';
import { createStripeOnboardingLinkAction, createStripeLoginLinkAction } from '@/app/actions/user.actions';
import type { ProfileData } from '@/types';
import { ExternalLink } from 'lucide-react';

interface StripeConnectManagerProps {
  profile: ProfileData;
}

export default function StripeConnectManager({ profile }: StripeConnectManagerProps) {
  const [isPending, startTransition] = useTransition();

  const handleConnect = () => {
    startTransition(async () => {
      const result = await createStripeOnboardingLinkAction(profile.id!);
      if (result.success && result.url) {
        // Redirigimos al usuario a la página de onboarding de Stripe
        window.location.href = result.url;
      } else {
        toast.error(result.message);
      }
    });
  };
  
  const handleManage = () => {
    startTransition(async () => {
      const result = await createStripeLoginLinkAction(profile.stripeAccountId!);
      if (result.success && result.url) {
        // Abrimos el panel de Stripe en una nueva pestaña
        window.open(result.url, '_blank');
      } else {
        toast.error(result.message);
      }
    });
  };

  const buttonStyle = "w-full sm:w-auto flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">Monetización</h2>
      <p className="text-sm text-slate-500 mt-1">Gestiona tu conexión con Stripe para poder recibir pagos por tus productos.</p>
      
      <div className="mt-6 p-4 bg-slate-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">Estado de la cuenta</p>
          {profile.stripeAccountId ? (
             <p className="text-sm font-semibold text-green-600">✅ Conectada y lista para recibir pagos.</p>
          ) : (
             <p className="text-sm font-semibold text-amber-600">⚠️ No conectada. Conéctate para empezar a vender.</p>
          )}
        </div>
        
        {profile.stripeAccountId ? (
            <button onClick={handleManage} disabled={isPending} className={buttonStyle}>
                {isPending ? 'Cargando...' : 'Gestionar cuenta'}
                <ExternalLink className="w-4 h-4 ml-2" />
            </button>
        ) : (
            <button onClick={handleConnect} disabled={isPending} className={buttonStyle}>
                {isPending ? 'Generando enlace...' : 'Conectar con Stripe'}
            </button>
        )}
      </div>
    </div>
  );
}