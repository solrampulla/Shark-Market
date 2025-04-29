// components/Header.tsx (o Header.js/jsx)
"use client"; // Necesario para Link y lógica condicional/eventos

import Link from 'next/link';
import type { Session } from '@supabase/supabase-js'; // Importa el tipo Session

// Definimos los tipos de las props que este componente espera recibir
interface HeaderProps {
  session: Session | null;
  loading: boolean;
  onLogout: () => Promise<void>; // Función que viene del layout
}

// Aceptamos las props en la definición del componente
export default function Header({ session, loading, onLogout }: HeaderProps) {
  return (
    // Usamos el estilo que tenías en el layout como ejemplo, puedes ajustarlo
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/"><h1 className="font-pacifico">Bizplan</h1></Link> {/* Enlace al inicio */}

      {/* Lógica condicional que movimos del layout aquí */}
      <div>
        {loading ? (
          <p>Cargando...</p>
        ) : session ? (
          // Si hay sesión (usuario logueado)
          <div>
            <span>Hola, {session?.user?.email ?? 'Usuario'}</span>
            <button onClick={onLogout} style={{ marginLeft: '10px' }}> {/* Llama a la función onLogout recibida como prop */}
              Cerrar Sesión
            </button>
          </div>
        ) : (
          // Si no hay sesión (usuario no logueado)
          <div>
            <Link href="/login" style={{ marginRight: '10px' }}>Iniciar Sesión</Link>
            <Link href="/register">Registro</Link>
          </div>
        )}
      </div>
    </header>
  );
}