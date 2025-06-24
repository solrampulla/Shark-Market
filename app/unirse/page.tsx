// File: app/unirse/page.tsx
// UPDATED: Guarda el rol seleccionado en localStorage

'use client';

import { useRouter } from 'next/navigation';
import React from 'react'; 

export default function ElegirRolPage() {
  const router = useRouter();

  const handleRoleSelection = (role: 'BUYER' | 'SELLER') => {
    // Guardar el rol seleccionado en localStorage
    try {
      localStorage.setItem('preselectedRole', role);
      console.log(`ElegirRolPage: Rol '${role}' guardado en localStorage.`);
    } catch (error) {
      console.error("ElegirRolPage: Error guardando rol en localStorage:", error);
      // Considera mostrar un error al usuario si localStorage no está disponible o falla.
      // Por ahora, continuamos con la redirección.
    }
    
    // Redirige a la página /register, pasando el rol como un parámetro en la URL
    // (el query param sigue siendo útil para el RegisterForm de email).
    router.push(`/register?role=${role}`);
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Únete a BizPlan Market
            </h1>
            <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
              ¿Cómo quieres participar en nuestra comunidad?
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => handleRoleSelection('BUYER')}
              className="w-full flex flex-col items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition duration-150 ease-in-out"
              aria-label="Registrarse como Comprador"
            >
              Soy Comprador
              <span className="block text-xs opacity-80 mt-1 font-normal">Quiero adquirir planes y herramientas de negocio.</span>
            </button>

            <button
              onClick={() => handleRoleSelection('SELLER')}
              className="w-full flex flex-col items-center justify-center px-6 py-3 border text-base font-medium rounded-md text-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light bg-opacity-20 hover:bg-opacity-30 dark:bg-opacity-100 dark:hover:bg-opacity-90 transition duration-150 ease-in-out text-secondary-dark dark:text-secondary-light border-secondary"
              aria-label="Registrarse como Vendedor"
            >
              Soy Vendedor
              <span className="block text-xs opacity-80 mt-1 font-normal">Quiero ofrecer mis planes y conocimientos.</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
