// File: app/register/page.tsx
"use client"; 

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import { auth, db } from '@/lib/firebase'; 
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth'; 
import { doc, setDoc, getDoc } from "firebase/firestore"; 

import RegisterForm from '@/components/auth/RegisterForm'; 
import Link from 'next/link'; 
import ClientOnly from '@/components/ClientOnly';
// ---> 1. IMPORTAMOS TOAST
import { toast } from 'sonner';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12.27V14.44H18.03C17.74,16.07 16.73,17.42 15.09,18.45V21.3H19.16C21.32,19.34 22.56,16.07 22.56,12.25Z" fill="#EA4335"/><path d="M12.27,24C15.3,24 17.84,22.97 19.16,21.3L15.09,18.45C14.09,19.16 12.81,19.56 11.28,19.56C8.39,19.56 5.91,17.65 4.96,14.9H0.89V17.79C2.76,21.47 6.59,24 12.27,24Z" fill="#34A853"/><path d="M4.96,14.9C4.73,14.22 4.59,13.47 4.59,12.7C4.59,11.93 4.73,11.18 4.96,10.5L0.89,7.61C0.32,8.87 0,10.22 0,11.7C0,13.18 0.32,14.53 0.89,15.79L4.96,14.9Z" fill="#FBBC05"/><path d="M12.27,4.84C13.81,4.84 15.03,5.42 15.99,6.34L19.24,3.1C17.84,1.79 15.3,0.91 12.27,0.91C6.59,0.91 2.76,3.53 0.89,7.61L4.96,10.5C5.91,7.75 8.39,5.84 11.28,5.84C11.63,5.84 11.97,5.88 12.27,4.84Z" fill="#4285F4"/></svg>
);

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedRole = searchParams.get('role'); 

  // ---> Hacemos el tipo explícito para mayor seguridad
  const validInitialRole = (preselectedRole === 'BUYER' || preselectedRole === 'SELLER') ? preselectedRole : undefined;

  // ---> 2. USAMOS useEffect PARA MOSTRAR ERRORES/INFO DE URL CON TOASTS
  useEffect(() => {
    const errorMessage = searchParams.get('error_description') || searchParams.get('error');
    const infoMessage = searchParams.get('message');

    if (errorMessage) {
      toast.error(errorMessage);
    }
    if (infoMessage) {
      toast.info(infoMessage);
    }
    
    // Limpiamos la URL para que los mensajes no persistan
    if (errorMessage || infoMessage) {
      const newPath = window.location.pathname + (validInitialRole ? `?role=${validInitialRole}` : '');
      window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
    }
  }, [searchParams, validInitialRole]);

  const handleOAuthLogin = async (providerName: 'google') => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const additionalUserInfo = getAdditionalUserInfo(userCredential);

      if (additionalUserInfo?.isNewUser) {
        await setDoc(doc(db, "profiles", user.uid), {
            email: user.email,
            full_name: user.displayName || "", 
            avatar_url: user.photoURL || null, 
            role: validInitialRole || 'BUYER', 
            createdAt: new Date().toISOString(),
        });
        toast.success('¡Cuenta creada con éxito!');
      } else {
        toast.info('Has iniciado sesión con tu cuenta de Google existente.');
      }
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info("El proceso de registro fue cancelado.");
      } else {
        toast.error(error.message || "Ocurrió un error desconocido.");
      }
    }
  };

  return (
    <ClientOnly>
      {/* ---> 3. APLICAMOS EL ESTILO DE PÁGINA CONSISTENTE */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" aria-label="Volver a la página principal">
                <span className="font-serif text-4xl font-bold text-text-DEFAULT">Founder Market</span>
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-text-DEFAULT">
              {validInitialRole ? `Regístrate como ${validInitialRole === 'SELLER' ? 'Vendedor' : 'Comprador'}` : 'Crear una Cuenta'}
            </h1>
          </div>
          
          <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-8 sm:p-10 space-y-6">
            {/* ---> ELIMINADO: Los divs de error/info. Ahora se usan toasts. */}
              
            <RegisterForm initialRole={validInitialRole} /> 

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-text-light">o</span></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg text-sm font-semibold text-text-DEFAULT bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                aria-label="Registrarse con Google"
              >
                <GoogleIcon />
                Continuar con Google
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-text-light">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-semibold text-accent hover:text-accent-hover underline">
                    Inicia sesión aquí
                </Link>
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}