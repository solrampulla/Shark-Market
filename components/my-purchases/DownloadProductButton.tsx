// --- ARCHIVO SIMPLIFICADO Y CORREGIDO: components/my-purchases/DownloadProductButton.tsx ---
// Ya no necesita ser un Client Component ni usar estado.

import React from 'react';
import Link from 'next/link';

interface DownloadProductButtonProps {
  // ---> CAMBIO: Ahora recibe la URL directa del archivo.
  fileURL: string; 
  productTitle: string;
}

export default function DownloadProductButton({ fileURL, productTitle }: DownloadProductButtonProps) {
  const buttonClasses = "w-full inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-md whitespace-nowrap transition disabled:opacity-60 disabled:cursor-not-allowed";

  // Si por alguna razón no hay URL, mostramos un botón desactivado.
  if (!fileURL) {
    return (
      <button disabled className={buttonClasses} title="Archivo no disponible">
        Descarga no disponible
      </button>
    );
  }

  // Si hay URL, es un simple enlace estilizado como un botón.
  return (
    <Link 
      href={fileURL} 
      target="_blank"
      download
      className={buttonClasses}
      title={`Descargar ${productTitle}`}
    >
      <i className="ri-download-2-line mr-2"></i>Descargar
    </Link>
  );
}