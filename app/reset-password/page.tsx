// app/reset-password/page.tsx
"use client";

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase'; 
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  type PageStatus = 'verifying_code' | 'ready_to_reset' | 'submitting' | 'success' | 'error' | 'no_code';
  const [status, setStatus] = useState<PageStatus>('verifying_code');
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const codeFromUrl = searchParams.get('oobCode'); 
    console.log("[ResetPasswordPage] oobCode de URL:", codeFromUrl);

    if (codeFromUrl) {
      setOobCode(codeFromUrl);
      setStatus('verifying_code');
      verifyPasswordResetCode(auth, codeFromUrl)
        .then((email) => {
          console.log("[ResetPasswordPage] Código verificado para email:", email);
          setVerifiedEmail(email);
          setErrorMessage(null);
          setStatus('ready_to_reset');
        })
        .catch((error) => {
          console.error("[ResetPasswordPage] Error al verificar código de reseteo:", error);
          setErrorMessage("El enlace de restablecimiento de contraseña es inválido o ha expirado. Por favor, solicita uno nuevo.");
          setStatus('error');
        });
    } else {
      console.warn('[ResetPasswordPage] No se encontró oobCode en la URL.');
      setErrorMessage("No se proporcionó un código de restablecimiento válido en el enlace.");
      setStatus('no_code'); 
    }
  }, [searchParams]); // auth no es necesario como dependencia aquí, ya que se usa dentro de las promesas


  const handlePasswordResetSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword || !confirmNewPassword) {
      setErrorMessage('Por favor, completa ambos campos de contraseña.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!oobCode) { 
        setErrorMessage("No hay un código de restablecimiento válido. Intenta de nuevo.");
        setStatus('error');
        return;
    }
    
    setIsSubmitting(true);
    setStatus('submitting'); 
    
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      console.log('[ResetPasswordPage] Contraseña actualizada exitosamente.');
      setSuccessMessage("¡Contraseña actualizada exitosamente! Serás redirigido a la página de inicio de sesión.");
      setStatus('success'); 
      setNewPassword(''); 
      setConfirmNewPassword('');
      
      setTimeout(() => {
        console.log("[ResetPasswordPage] Redirigiendo a /login..."); // CONSOLE.LOG AÑADIDO AQUÍ
        router.push('/login?message=Contraseña actualizada.');
      }, 3000);

    } catch (error: any) {
      console.error('[ResetPasswordPage] Error al confirmar nueva contraseña:', error);
      let userMessage = "Error al actualizar la contraseña.";
      if (error.code === 'auth/expired-action-code') {
        userMessage = "El enlace de restablecimiento ha expirado. Por favor, solicita uno nuevo.";
      } else if (error.code === 'auth/invalid-action-code') {
        userMessage = "El enlace de restablecimiento es inválido. Por favor, solicita uno nuevo.";
      } else if (error.code === 'auth/user-disabled') {
        userMessage = "Esta cuenta de usuario ha sido deshabilitada.";
      } else if (error.code === 'auth/user-not-found') {
        userMessage = "No se encontró un usuario para este enlace de restablecimiento.";
      } else if (error.code === 'auth/weak-password') {
        userMessage = "La nueva contraseña es demasiado débil.";
      }
      setErrorMessage(userMessage);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [newPassword, confirmNewPassword, oobCode, router, auth]); 
  
  const labelStyle = "block text-sm font-medium text-slate-200";
  const inputStyle = "appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-slate-700 text-white disabled:opacity-70";
  const buttonStyle = "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:opacity-50";

  let content;
  switch (status) {
    case 'verifying_code':
      content = <p className="text-center text-slate-300 animate-pulse">Verificando enlace...</p>;
      break;
    case 'ready_to_reset':
      content = (
        <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
          {verifiedEmail && <p className="text-center text-sm text-slate-300">Restableciendo contraseña para: <strong>{verifiedEmail}</strong></p>}
          <div>
            <label htmlFor="newPassword" className={labelStyle}>Nueva Contraseña</label>
            <input id="newPassword" name="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSubmitting} className={inputStyle} placeholder="Mínimo 6 caracteres"/>
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className={labelStyle}>Confirmar Nueva Contraseña</label>
            <input id="confirmNewPassword" name="confirmNewPassword" type="password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isSubmitting} className={inputStyle} />
          </div>
          <button type="submit" disabled={isSubmitting} className={buttonStyle}>
            {isSubmitting ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
          </button>
        </form>
      );
      break;
    case 'submitting':
      content = <p className="text-center text-slate-300 animate-pulse">Actualizando contraseña...</p>;
      break;
    case 'success':
      content = <p className="text-center text-green-300">{successMessage}</p>;
      break;
    case 'error':
    case 'no_code':
      content = (
        <div className="text-center">
          <Link href="/forgot-password" className="font-medium text-sky-400 hover:text-sky-300">
            Solicitar un nuevo enlace de restablecimiento
          </Link>
        </div>
      );
      break;
    default:
      content = <p className="text-center text-slate-300">Cargando...</p>;
  }

  return ( 
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
        <Link href="/" aria-label="Volver a la página principal">
          <div className="text-center text-2xl font-pacifico text-sky-400 hover:text-sky-300">BizPlan Market</div>
        </Link>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Restablecer Contraseña
        </h2>
        
        {errorMessage && !successMessage && (
          <div className="p-3 my-4 rounded-md text-sm bg-red-700/30 text-red-300 border border-red-500/50">
            {errorMessage}
          </div>
        )}
        <div className="mt-2"> 
          {content}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
        // <Suspense fallback={<div>Cargando parámetros...</div>}> // Suspense no es estrictamente necesario aquí si toda la página es cliente
            <ResetPasswordForm />
        // </Suspense>
    );
}