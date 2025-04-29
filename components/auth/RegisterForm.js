// components/auth/RegisterForm.js
"use client"; // Necesario por useState

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Importa el cliente Supabase

function RegisterForm() {
  // Estados para guardar el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para login email/pass
  const [error, setError] = useState('');     // Estado para mostrar errores

  // Manejador para cuando se envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(''); // Limpia errores anteriores
    setLoading(true); // Indica que estamos procesando

    console.log('Enviando a Supabase para registro:', { email, password });

    try {
      // --- INICIO: Llamada a Supabase signUp ---
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email, // El email del estado
        password: password, // La contraseña del estado
        // Opcional: Puedes añadir una URL a la que redirigir al usuario DESPUÉS de que haga clic en el enlace de verificación de email
        // options: {
        //   emailRedirectTo: `${window.location.origin}/` // Ej: redirige a la página principal
        // }
      });
      // --- FIN: Llamada a Supabase signUp ---

      // Si Supabase devuelve un error específico durante el signUp
      if (signUpError) {
        throw signUpError;
      }

      // ¡Éxito! PERO probablemente requiera verificación por email
      console.log('Respuesta de signUp:', data);
      alert('¡Registro exitoso! Revisa tu correo electrónico para verificar tu cuenta.'); // Mensaje simple para el usuario
      // Nota: Supabase puede estar configurado para requerir verificación de email.
      // En ese caso, data.user podría existir, pero data.session será null hasta que se verifique.
      // No redirigimos ni limpiamos campos aún para que el usuario vea el mensaje.
      // setEmail(''); // Opcional: Limpiar campos tras envío si el registro fuera automático
      // setPassword('');

    } catch (error) {
      // Captura cualquier error (de la llamada a signUp o si lanzamos signUpError)
      // Aseguramos que error sea de tipo Error para acceder a message
      let errorMessage = 'Ocurrió un error durante el registro.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error("Error en el registro:", errorMessage);
      setError(errorMessage); // Muestra el error al usuario
    } finally {
      // Esto se ejecuta siempre, haya error o no
      setLoading(false); // Deja de indicar que estamos procesando
    }
  };

  // El JSX del formulario se mantiene igual que antes
  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={loading} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}

export default RegisterForm;