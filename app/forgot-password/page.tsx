// app/forgot-password/page.tsx
"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Para mensajes de éxito o error
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // URL a la que Supabase redirigirá al usuario DESPUÉS de hacer clic en el enlace del correo.
      // ¡¡Esta página /reset-password aún no existe, la crearemos después!!
      const resetPasswordUrl = `${window.location.origin}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetPasswordUrl,
      });

      if (resetError) {
        throw resetError;
      }

      setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada (y spam).');

    } catch (error: any) {
      console.error("Error al solicitar reseteo:", error);
      setError(error.message || 'No se pudo enviar el enlace de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Recuperar Contraseña</h1>
      <p>Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/login">Volver a Iniciar Sesión</Link>
      </div>
    </div>
  );
}