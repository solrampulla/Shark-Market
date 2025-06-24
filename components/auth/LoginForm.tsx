// File: components/auth/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// ---> 1. IMPORTAMOS TOAST PARA LAS NOTIFICACIONES
import { toast } from 'sonner';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  // ---> 2. ELIMINAMOS EL ESTADO DE ERROR. Usaremos toasts en su lugar.
  // const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingEmail(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ---> 3. AÑADIMOS FEEDBACK DE ÉXITO CON TOAST
      toast.success('¡Sesión iniciada! Redirigiendo...');
      router.push('/');

    } catch (firebaseError: any) {
      let errorMessage = 'Ocurrió un error inesperado.';
      
      if (firebaseError.code === 'auth/invalid-credential') {
        errorMessage = 'Email o contraseña incorrectos. Por favor, verifica tus credenciales.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (firebaseError.code === 'auth/user-disabled') {
        errorMessage = 'Esta cuenta de usuario ha sido deshabilitada.';
      }
      
      console.error("[LoginForm] Firebase login error:", firebaseError.code, errorMessage);
      // ---> 4. REEMPLAZAMOS setError POR toast.error
      toast.error(errorMessage);
    } finally {
      setLoadingEmail(false);
    }
  };

  // ---> 5. DEFINIMOS NUESTRO NUEVO "SISTEMA DE DISEÑO" PARA FORMULARIOS
  const labelStyle = "block text-sm font-semibold text-text-light mb-1";
  const inputStyle = "block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent sm:text-sm bg-white text-text-DEFAULT disabled:bg-slate-50";
  const buttonStyle = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    // El div principal ya no necesita un space-y-6 tan grande, el form lo maneja.
    <div>
      {/* ---> ELIMINADO: El div que mostraba el error estático. */}
      
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label htmlFor="login-email" className={labelStyle}>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="login-email"
            name="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loadingEmail}
            className={inputStyle}
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className={labelStyle}>
            Contraseña
          </label>
          <input
            type="password"
            id="login-password"
            name="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loadingEmail}
            className={inputStyle}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loadingEmail}
          className={buttonStyle}
        >
          {loadingEmail ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="text-sm text-center mt-4">
        {/* ---> CAMBIO: Link actualizado con nuestro color 'accent' */}
        <Link href="/forgot-password" className="font-semibold text-accent hover:text-accent-hover underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;