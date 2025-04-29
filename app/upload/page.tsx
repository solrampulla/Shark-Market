// app/upload/page.tsx
"use client"; // Necesitaremos cliente para el formulario interactivo

import UploadForm from '../../components/upload/UploadForm';

export default function UploadPage() {
  return (
    <div>
      <h1>Sube tu Plantilla o Plan de Negocio</h1>
      <p>Comparte tu conocimiento y monetízalo.</p>
      <div style={{ marginTop: '2rem' }}>
        <UploadForm /> {/* Aquí renderizaremos el formulario */}
      </div>
    </div>
  );
}