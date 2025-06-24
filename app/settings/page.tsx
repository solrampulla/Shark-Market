// app/settings/page.tsx (Server Component Simplificado)
// --- EN: app/settings/page.tsx ---

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración de la Cuenta | Founder Market',
  description: 'Gestiona tu perfil, información de contacto y configuración de pagos.',
};

// ... el resto de tu componente SettingsPage ...

// Ya no necesitamos importar nada de Firebase aquí directamente para el usuario
import SettingsFormWrapper from '@/components/settings/SettingsFormWrapper';

// Las interfaces ProfileData y User se manejarán ahora dentro de SettingsFormWrapper
// o se importarán allí si son globales.

export default async function SettingsPage() {
  // Este Server Component ya no intenta obtener el usuario o el perfil.
  // Esa responsabilidad se moverá al SettingsFormWrapper (Client Component).
  console.log("SettingsPage (Server Component): Renderizando SettingsFormWrapper.");

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Configuración de la Cuenta</h1>
      <div className="max-w-lg bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border dark:border-slate-700">
        <SettingsFormWrapper /> {/* Ya no pasamos user ni profileData como props desde aquí */}
      </div>
    </div>
  );
}