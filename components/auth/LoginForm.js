// components/auth/LoginForm.js
"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <--- AÑADIDA IMPORTACIÓN DE LINK

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Manejador para login con Email/Password (sin cambios respecto al último)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingEmail(true);
    console.log('Enviando a Supabase para login:', { email, password });

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      console.log('>>> LoginForm: Login Email/Pass Exitoso! Data:', data);
      router.push('/'); // Redirige a la home

    } catch (error) {
      let errorMessage = 'Email o contraseña incorrectos.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error("Error al iniciar sesión:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoadingEmail(false);
    }
  };

  // Manejador para login con Google (sin cambios respecto al último)
  const handleGoogleLogin = async () => {
    setError('');
    setLoadingGoogle(true);
    console.log('Iniciando sesión con Google...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      console.log('Redirigiendo a Google...');
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión con Google.';
       if (error instanceof Error) errorMessage = error.message;
       else if (typeof error === 'string') errorMessage = error;
      console.error("Error al iniciar sesión con Google:", errorMessage);
      setError(errorMessage);
      setLoadingGoogle(false);
    }
  };

  // JSX del formulario
  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form onSubmit={handleEmailLogin}>
        <h2>Iniciar Sesión con Email</h2>
        {/* Inputs de Email y Contraseña (sin cambios) */}
        <div>
          <label htmlFor="login-email">Email:</label>
          <input type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loadingEmail || loadingGoogle} />
        </div>
        <div>
          <label htmlFor="login-password">Contraseña:</label>
          <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loadingEmail || loadingGoogle} />
        </div>
        <button type="submit" disabled={loadingEmail || loadingGoogle}>
          {loadingEmail ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* --- INICIO: Enlace "Olvidé Contraseña" Añadido --- */}
      <div style={{ marginTop: '1rem', fontSize: '0.9em' }}>
        <Link href="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>
      {/* --- FIN: Enlace "Olvidé Contraseña" Añadido --- */}


      <hr style={{ margin: '20px 0' }} />

      {/* Botón Google Login (sin cambios) */}
      <div>
        <h2>O inicia sesión con</h2>
        <button onClick={handleGoogleLogin} type="button" disabled={loadingEmail || loadingGoogle}>
          {loadingGoogle ? 'Conectando...' : 'Iniciar Sesión con Google'}
        </button>
      </div>
    </div>
  );
}

export default LoginForm;