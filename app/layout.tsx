// app/layout.tsx (Combinado)
"use client"; // Necesario por los hooks

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js'; // Tipo Session
import { supabase } from '@/lib/supabaseClient';      // Cliente Supabase
import Link from 'next/link';                         // Enlaces Next.js
import { Inter, Pacifico } from 'next/font/google';   // Fuentes del original
import './globals.css';                               // Estilos globales del original
import Header from "@/components/Header";             // Header del original
import Footer from "@/components/Footer";             // Footer del original

// Configuración de fuentes (del original)
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: '--font-pacifico',
  display: 'swap',
});

// Metadata se elimina porque este es un Client Component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Lógica de sesión (del actual)
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Estructura HTML y clases (del original)
    <html lang="es" className={`${inter.variable} ${pacifico.variable}`}>
      <head>
        {/* Link a Remixicon (del original) */}
        <link
            href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
            rel="stylesheet"
        />
      </head>
      {/* Clases en Body (del original) */}
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        {/* Renderiza Header pasándole props (combinado) */}
        {/* Header necesitará ser modificado para usar estas props */}
        <Header session={session} loading={loading} onLogout={handleLogout} />

        {/* Estructura Main (del original) */}
        <main className="flex-grow pt-[60px]">
          {children} {/* Renderiza el contenido de la página actual */}
        </main>

        {/* Renderiza Footer (del original) */}
        <Footer />
      </body>
    </html>
  );
}