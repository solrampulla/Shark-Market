// --- ARCHIVO FINAL Y CORREGIDO ---
"use client";

import React, { useState, useEffect, Suspense } from 'react'; // Se añade Suspense
import { useSearchParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from 'next/link';
import { toast } from 'sonner';

import LoginForm from '@/components/auth/LoginForm';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12.27V14.44H18.03C17.74,16.07 16.73,17.42 15.09,18.45V21.3H19.16C21.32,19.34 22.56,16.07 22.56,12.25Z" fill="#EA4335"/><path d="M12.27,24C15.3,24 17.84,22.97 19.16,21.3L15.09,18.45C14.09,19.16 12.81,19.56 11.28,19.56C8.39,19.56 5.91,17.65 4.96,14.9H0.89V17.79C2.76,21.47 6.59,24 12.27,24Z" fill="#34A853"/><path d="M4.96,14.9C4.73,14.22 4.59,13.47 4.59,12.7C4.59,11.93 4.73,11.18 4.96,10.5L0.89,7.61C0.32,8.87 0,10.22 0,11.7C0,13.18 0.32,14.53 0.89,15.79L4.96,14.9Z" fill="#FBBC05"/><path d="M12.27,4.84C14.09,4.84 15.24,5.35 16.08,6.14L19.24,3.1C17.33,1.46 14.96,0.73 12.27,0.73C6.59,0.73 2.76,3.35 0.89,7.43L4.96,10.32C5.91,7.57 8.39,5.66 11.28,5.66C11.63,5.66 11.97,5.7 12.27,4.84Z" fill="#4285F4"/></svg>
);

// ========================================================================
// ---> INICIO: Contenido del Cliente
// Se mueve toda la lógica a un componente interno.
// ========================================================================
function LoginComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
  
    useEffect(() => {
        const errorMessage = searchParams.get('error_description') || searchParams.get('error');
        const infoMessage = searchParams.get('message');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        if (infoMessage) {
            toast.info(infoMessage);
        }

        if (errorMessage || infoMessage) {
            const newPath = window.location.pathname;
            window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
        }
    }, [searchParams]);

    const handleOAuthLogin = async (providerName: 'google') => {
        if (providerName !== 'google') {
            toast.error("Proveedor OAuth no soportado.");
            return;
        }

        const provider = new GoogleAuthProvider();
    
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const additionalUserInfo = getAdditionalUserInfo(userCredential);

            if (additionalUserInfo?.isNewUser) {
                const profileDocRef = doc(db, "profiles", user.uid);
                const profileSnap = await getDoc(profileDocRef);
                if (!profileSnap.exists()) {
                    await setDoc(profileDocRef, {
                        email: user.email,
                        full_name: user.displayName || "",
                        avatar_url: user.photoURL || null,
                        role: 'BUYER',
                        createdAt: new Date().toISOString(),
                    });
                }
            }
            toast.success('¡Bienvenido de nuevo!');
            router.push('/');
        } catch (error: any) {
            console.error(`[LoginPage] Error con Google Sign-In:`, error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.info("El proceso de inicio de sesión fue cancelado.");
            } else {
                toast.error(error.message || "Ocurrió un error desconocido.");
            }
        }
    };
  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" aria-label="Volver a la página principal">
                        <span className="font-serif text-4xl font-bold text-text-DEFAULT">Shark Market</span>
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold text-text-DEFAULT">
                        Iniciar Sesión
                    </h1>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-8 sm:p-10 space-y-6">
                    <LoginForm />
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-text-light">o</span></div>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => handleOAuthLogin('google')}
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg text-sm font-semibold text-text-DEFAULT bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                            aria-label="Iniciar sesión con Google"
                        >
                            <GoogleIcon />
                            Continuar con Google
                        </button>
                    </div>
                    <p className="mt-6 text-center text-sm text-text-light">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/register" className="font-semibold text-accent hover:text-accent-hover underline">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


// ========================================================================
// ---> INICIO: Componente Principal de la Página
// Se envuelve el componente de cliente en un Suspense.
// ========================================================================
export default function LoginPage() {
    return (
        // El componente ClientOnly puede que ya no sea necesario si toda la página es cliente,
        // pero lo mantenemos por si tiene otra función.
        // Lo importante es el Suspense.
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <LoginComponent />
        </Suspense>
    );
}