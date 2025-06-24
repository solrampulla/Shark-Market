// app/forgot-password/page.tsx
"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase'; // Importamos la instancia de auth de Firebase
import { sendPasswordResetEmail } from 'firebase/auth'; // Importamos la función de Firebase

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition(); 
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!email.trim()) { // Añadido .trim() para validación
      setMessage("Por favor, ingresa tu dirección de email.");
      setIsError(true);
      return;
    }

    startTransition(async () => {
      console.log("[ForgotPasswordPage] Solicitando reseteo para:", email);
      try {
        // Usamos sendPasswordResetEmail de Firebase
        // No se necesita redirectTo aquí como en Supabase para esta función específica,
        // Firebase maneja la URL de reseteo basada en la configuración de la plantilla de email en la consola.
        await sendPasswordResetEmail(auth, email);

        // Mensaje genérico por seguridad (Firebase no confirma si el email existe)
        setMessage("Si tu dirección de correo electrónico está en nuestra base de datos, recibirás un correo con instrucciones para restablecer tu contraseña en unos minutos. Por favor, revisa también tu carpeta de spam.");
        setIsError(false);
        setEmail(''); 
      } catch (firebaseError: any) {
        console.error("[ForgotPasswordPage] Error al solicitar reseteo de contraseña:", firebaseError);
        let userMessage = "Error al enviar el email de recuperación. Intenta de nuevo más tarde.";
        if (firebaseError.code === 'auth/invalid-email') {
            userMessage = "El formato del correo electrónico no es válido.";
        } else if (firebaseError.code === 'auth/user-not-found') {
            // Aunque Firebase no lo confirma, si devuelve este error específico, podemos dar el mensaje genérico.
            // Opcionalmente, podrías decidir no cambiar el mensaje para no revelar si un email existe o no.
            // Por consistencia con la recomendación de Firebase, mantenemos el mensaje genérico.
             userMessage = "Si tu dirección de correo electrónico está en nuestra base de datos, recibirás un correo con instrucciones para restablecer tu contraseña en unos minutos. Por favor, revisa también tu carpeta de spam.";
             setIsError(false); // Para que el mensaje no aparezca como un error rojo
             setMessage(userMessage);
             return; // Salimos para no setear el mensaje de error de abajo
        }
        setMessage(userMessage);
        setIsError(true);
      }
    });
  };

  const labelStyle = "block text-sm font-medium text-slate-200";
  const inputStyle = "appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-slate-700 text-white disabled:opacity-70";
  const buttonStyle = "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:opacity-50";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
        <Link href="/" aria-label="Volver a la página principal">
            {/* Asegúrate que el logo/nombre tenga buen contraste o sea visible */}
            <div className="text-center text-2xl font-pacifico text-sky-400 hover:text-sky-300">BizPlan Market</div> 
        </Link>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            No te preocupes. Ingresa tu email y te enviaremos un enlace para restablecerla.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={labelStyle}>
              Dirección de Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
                placeholder="tu@email.com"
                disabled={isPending}
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              isError 
              ? 'bg-red-700/30 text-red-300 border border-red-500/50' 
              : 'bg-green-700/30 text-green-300 border border-green-500/50'
            }`}
            >
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className={buttonStyle}
            >
              {isPending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="font-medium text-sky-400 hover:text-sky-300">
            Volver a Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}