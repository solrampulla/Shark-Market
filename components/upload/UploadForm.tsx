// components/upload/UploadForm.tsx
"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // <-- NUEVO estado para imagen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manejador para el archivo principal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log('Archivo principal seleccionado:', e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // <-- NUEVO manejador para el archivo de imagen -->
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageFile(e.target.files[0]);
      console.log('Archivo de imagen seleccionado:', e.target.files[0]);
    } else {
      setSelectedImageFile(null);
    }
  };

  // Manejador de envío actualizado
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- Validaciones ---
    if (!selectedFile) { // Validar archivo principal
      setError('Por favor, selecciona el archivo principal del producto.');
      setLoading(false);
      return;
    }
    // No haremos obligatoria la imagen de vista previa por ahora
    // if (!selectedImageFile) {
    //   setError('Por favor, selecciona una imagen de vista previa.');
    //   setLoading(false);
    //   return;
    // }
    const numericPrice = parseFloat(price);
    if (!title || !description || isNaN(numericPrice) || numericPrice < 0) {
        setError('Por favor, completa título, descripción y precio correctamente.');
        setLoading(false);
        return;
    }

    let imageUrlToSave: string | null = null; // Variable para guardar la URL pública de la imagen
    let mainFilePath: string | null = null; // Variable para guardar la ruta del archivo principal

    try {
        // --- Obtener Sesión ---
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session || !session.user) {
            throw new Error(sessionError?.message || 'No se pudo obtener la sesión. ¿Has iniciado sesión?');
        }
        const userId = session.user.id;
        console.log('Usuario ID:', userId);

        // --- Subir Archivo Principal ---
        const mainFileName = selectedFile.name; // Guardamos nombre por si necesitamos borrar en error
        const mainPath = `${userId}/${mainFileName}`;
        console.log('Subiendo archivo principal a Storage en:', mainPath);
        const { data: mainStorageData, error: mainStorageError } = await supabase
          .storage
          .from('product-files')
          .upload(mainPath, selectedFile, { cacheControl: '3600', upsert: false });

        if (mainStorageError) { throw mainStorageError; }
        console.log('Archivo principal subido:', mainStorageData);
        mainFilePath = mainStorageData.path; // Guardamos la ruta para la BD

        // --- Subir Imagen (si existe) ---
        if (selectedImageFile) {
            // Creamos un nombre único o estandarizado para la imagen
            const imageExtension = selectedImageFile.name.split('.').pop();
            const imageName = `preview_${Date.now()}.${imageExtension}`; // Nombre más único
            const imagePath = `${userId}/${imageName}`;
            console.log('Subiendo imagen a Storage en:', imagePath);

            const { data: imageStorageData, error: imageStorageError } = await supabase
              .storage
              .from('product-files') // O un bucket diferente si prefieres ej. 'product-images'
              .upload(imagePath, selectedImageFile, { cacheControl: '3600', upsert: false });

            if (imageStorageError) { throw imageStorageError; }
            console.log('Imagen subida:', imageStorageData);

            // Obtenemos la URL pública de la imagen subida
            const { data: publicUrlData } = supabase
              .storage
              .from('product-files') // Mismo bucket donde se subió
              .getPublicUrl(imagePath);

            imageUrlToSave = publicUrlData?.publicUrl || null;
            console.log('URL Pública de la Imagen:', imageUrlToSave);
        } // Fin del if (selectedImageFile)

        // --- Guardado en Base de Datos ---
        console.log('Guardando metadatos en la tabla products...');
        const { data: dbData, error: dbError } = await supabase
          .from('products')
          .insert([{
             title: title,
             description: description,
             price: numericPrice,
             file_path: mainFilePath, // Usamos la ruta guardada del archivo principal
             user_id: userId,
             type: 'general', // Mantenemos valor por defecto
             image_url: imageUrlToSave // Usamos la URL pública de la imagen (o null si no se subió)
           }])
           .select();

        if (dbError) {
            // Idealmente, si falla el insert en DB, borrar los archivos subidos a Storage
            console.error('Error guardando en DB:', dbError);
            // await supabase.storage.from('product-files').remove([mainPath]); // Borrar archivo principal
            // if (imageUrlToSave) { // Si hubo imagen, obtener su path y borrarla
            //   const imagePathToDelete = imageUrlToSave.split('/').slice(-2).join('/'); // Extraer path de URL pública
            //   await supabase.storage.from('product-files').remove([imagePathToDelete]);
            // }
            throw new Error(`Error al guardar el producto en la base de datos: ${dbError.message}`);
        }
        console.log('Producto guardado en DB:', dbData);

        alert('¡Producto subido (archivo e imagen si aplica) y guardado en DB con éxito!');
         // Limpiar formulario
         setTitle('');
         setDescription('');
         setPrice('');
         setSelectedFile(null);
         setSelectedImageFile(null); // Limpiar también imagen
         const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
         if (fileInput) fileInput.value = '';
         const imageInput = document.getElementById('imageUpload') as HTMLInputElement;
         if (imageInput) imageInput.value = '';

    } catch (error: any) {
        console.error("Error durante la subida/guardado:", error);
        // ... (Manejo de errores como antes) ...
        let displayError = error.message || 'Ocurrió un error.';
        // ... (Podríamos añadir más mensajes específicos para errores de imagen) ...
        setError(displayError);
    } finally {
        setLoading(false);
    }
  };


  // --- JSX Actualizado ---
  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Campos Título, Descripción, Precio (sin cambios) */}
      <div><label htmlFor="title">Título:</label><br /><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }}/></div>
      <div style={{ marginTop: '1rem' }}><label htmlFor="description">Descripción:</label><br /><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={loading} rows={4} style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }}/></div>
      <div style={{ marginTop: '1rem' }}><label htmlFor="price">Precio ($):</label><br /><input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" disabled={loading} style={{ border: '1px solid #ccc', padding: '8px', width: '100px' }}/></div>

       {/* Input para Archivo Principal */}
       <div style={{ marginTop: '1rem' }}>
        <label htmlFor="fileUpload">Archivo Principal (PDF, Excel, etc.):</label><br />
        <input type="file" id="fileUpload" onChange={handleFileChange} required disabled={loading} />
         {selectedFile && <p style={{fontSize: '0.8em', color: 'gray'}}>Seleccionado: {selectedFile.name}</p>}
      </div>

       {/* --- NUEVO: Input para Imagen de Vista Previa --- */}
       <div style={{ marginTop: '1rem' }}>
        <label htmlFor="imageUpload">Imagen de Vista Previa (Opcional):</label><br />
        <input
          type="file"
          id="imageUpload"
          onChange={handleImageFileChange} // <-- Nuevo handler
          disabled={loading}
          accept="image/*" // <-- Sugerir solo archivos de imagen
        />
         {selectedImageFile && <p style={{fontSize: '0.8em', color: 'gray'}}>Imagen seleccionada: {selectedImageFile.name}</p>}
      </div>
      {/* --- Fin Nuevo Input --- */}

      <div style={{ marginTop: '1.5rem' }}>
        <button type="submit" disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          {loading ? 'Subiendo...' : 'Subir Producto'}
        </button>
      </div>
    </form>
  );
}