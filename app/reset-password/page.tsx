// app/reset-password/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [allowPasswordUpdate, setAllowPasswordUpdate] = useState(false); // Para habilitar el form sólo si estamos en sesión de recuperación
  const router = useRouter();

  useEffect(() => {
    // Escuchamos el evento especial PASSWORD_RECOVERY
    // Supabase lo dispara cuando el usuario llega desde el enlace de reseteo
    // y maneja el token de la URL internamente para establecer la sesión correcta
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          console.log(">>> ResetPasswordPage: Evento PASSWORD_RECOVERY detectado, permitiendo actualización.");
          setMessage("Puedes establecer tu nueva contraseña.");
          setAllowPasswordUpdate(true); // Habilita el formulario
        } else {
           console.log(">>> ResetPasswordPage: Evento Auth:", event);
        }
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validar que las contraseñas coinciden
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // Validar longitud mínima
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Actualizar la contraseña del usuario
      // Esto sólo funciona si Supabase ha establecido la sesión
      // correctamente tras llegar desde el enlace de reseteo (evento PASSWORD_RECOVERY)
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      console.log("Contraseña actualizada con éxito:", data);
      setMessage('¡Contraseña actualizada correctamente! Redirigiendo a inicio de sesión...');
      // Esperar un poco para que el usuario lea el mensaje
      setTimeout(() => {
        router.push('/login'); // Redirige a la página de login
      }, 2000);

    } catch (error: any) {
      console.error("Error al actualizar contraseña:", error);
      setError(error.message || 'No se pudo actualizar la contraseña.');
      setLoading(false); // Asegurarse de quitar el loading en caso de error
    }
    // No ponemos setLoading(false) en el 'finally' aquí
    // porque si hay éxito, queremos que quede deshabilitado hasta redirigir.
  };

  // Si aún no estamos seguros de estar en modo recuperación, mostramos mensaje
  if (!allowPasswordUpdate && !error) {
       return (
           <div>
               <h1>Verificando enlace...</h1>
               <p>Espera un momento mientras procesamos tu solicitud de recuperación.</p>
               <p>Si no has llegado aquí desde un enlace de tu correo, por favor, solicita la recuperación desde la <a href="/forgot-password">página de recuperación de contraseña</a>.</p>
               {/* Mostrar error si existiera incluso antes de habilitar */}
               {error && <p style={{ color: 'red' }}>Error: {error}</p>}
           </div>
       );
   }


  // Renderiza el formulario una vez que allowPasswordUpdate es true
  return (
    <div>
      <h1>Establecer Nueva Contraseña</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div>
          <label htmlFor="new-password">Nueva Contraseña:</label><br />
          <input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="confirm-password">Confirmar Nueva Contraseña:</label><br />
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" disabled={loading || !allowPasswordUpdate} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
}