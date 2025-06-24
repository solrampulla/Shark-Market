// File: components/ClientOnly.tsx
'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

// Este componente solo renderizará sus hijos en el lado del cliente (después de la hidratación).
// Esto es útil para envolver componentes que intentan acceder a APIs del navegador (como localStorage)
// durante el renderizado inicial en el servidor.
export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // En el servidor, o antes de que el componente se "monte" en el cliente,
    // no renderizamos los hijos para evitar errores de hidratación/SSR.
    // Puedes devolver un fallback (ej. un spinner) si quieres.
    return null; // O <div style={{ height: '500px', width: '100%' }}>Cargando...</div>;
  }

  // Una vez montado en el cliente, renderizamos los hijos.
  return <>{children}</>;
}