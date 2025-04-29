// app/my-products/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation'; // useParams para ID, useRouter para redirigir
import type { Product } from '@/lib/sample-data'; // Importa el tipo Product

export default function EditProductPage() {
  // Obtener ID de la URL
  const params = useParams();
  const productId = typeof params.id === 'string' ? params.id : undefined;
  const router = useRouter();

  // Estados del formulario (inicializar vacíos)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState(''); // Guardaremos el tipo actual

  // Estados de Carga y Error
  const [loading, setLoading] = useState(true); // Empieza cargando datos iniciales
  const [saving, setSaving] = useState(false); // Estado para el proceso de guardado
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Función para cargar los datos del producto existente
  const fetchProductData = useCallback(async () => {
    if (!productId) {
      setError("ID de producto inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtener datos del producto específico
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single(); // Esperamos solo uno

      if (fetchError) throw fetchError;

      if (!productData) {
        throw new Error("Producto no encontrado.");
      }

      // Comprobar si el usuario actual es el dueño (requiere sesión)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== productData.user_id) {
        throw new Error("No tienes permiso para editar este producto.");
      }

      // Rellenar el estado del formulario con los datos cargados
      setTitle(productData.title);
      setDescription(productData.description || '');
      setPrice(productData.price.toString()); // Convertir a string para el input
      setType(productData.type || 'general'); // Usar valor o default

    } catch (err: any) {
      console.error("Error fetching product for edit:", err);
      setError(err.message || "Error al cargar los datos del producto.");
    } finally {
      setLoading(false);
    }
  }, [productId]); // Depende del productId

  // Ejecutar la carga de datos cuando el componente se monta o productId cambia
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);


  // Manejador para guardar los cambios
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSaving(true);

    // Validar precio
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Por favor, introduce un precio válido.');
      setSaving(false);
      return;
    }
    if (!title || !description) {
       setError('Título y descripción no pueden estar vacíos.');
       setSaving(false);
       return;
     }

    try {
      // Objeto con los datos a actualizar
      const updateData = {
        title: title,
        description: description,
        price: numericPrice,
        type: type // Actualizamos el tipo también
        // Nota: No actualizamos file_path ni image_url aquí.
        // La edición/reemplazo de archivos es más compleja y se haría por separado.
      };

      // Ejecutar el update en Supabase
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId); // Asegurarse de actualizar solo este producto

      if (updateError) {
        throw updateError;
      }

      console.log("Producto actualizado:", data);
      setSuccessMessage('¡Producto actualizado con éxito!');
      // Opcional: redirigir tras un pequeño retraso
      setTimeout(() => {
        router.push('/my-products'); // Volver a la lista de mis productos
        // O router.refresh() si quieres recargar datos en la misma página
      }, 1500);

    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      setError(error.message || 'Ocurrió un error al guardar los cambios.');
      setSaving(false); // Permitir reintentar
    }
    // No ponemos setSaving(false) en finally para que el botón quede deshabilitado tras éxito hasta redirigir
  };

  // Renderizado condicional durante la carga inicial
  if (loading) {
    return <div className="container mx-auto p-8 text-center">Cargando datos del producto...</div>;
  }

  // Renderizado si hubo error al cargar
  if (error && !title) { // Si hay error y no llegamos a cargar datos
    return <div className="container mx-auto p-8 text-center text-red-500">Error: {error}</div>;
  }

  // Renderizado del formulario
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1>Editar Producto</h1>

      <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
        {/* Mostrar mensaje de éxito o error del guardado */}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {/* Campos pre-rellenados */}
        <div>
          <label htmlFor="title">Título:</label><br />
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={saving} style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="description">Descripción:</label><br />
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={saving} rows={4} style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="price">Precio ($):</label><br />
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" disabled={saving} style={{ border: '1px solid #ccc', padding: '8px', width: '100px' }} />
        </div>
         {/* Podríamos añadir aquí un selector para el campo 'type' si quisiéramos poder cambiarlo */}
         <div style={{ marginTop: '1rem' }}>
            <label htmlFor="type">Tipo:</label><br />
            <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} required disabled={saving} style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }} />
            {/* Más adelante cambiar por un <select> */}
         </div>

         <p style={{fontSize: '0.8em', color: 'gray', marginTop: '1rem'}}>Nota: La edición del archivo principal o la imagen de vista previa no está implementada en este formulario.</p>

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            {saving ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}