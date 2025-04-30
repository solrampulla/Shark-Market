// components/upload/UploadForm.tsx (VERSION CON CAMPOS DE ESTIMACIONES)
"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Asumiendo ruta correcta

// --- Listas de Opciones para los Selects ---
const PRODUCT_TYPES = ["Business Plan", "Excel Template", "Marketing Plan", "Other"];
const INDUSTRIES = ["E-commerce", "Retail", "Services", "Technology", "Food & Beverage", "Real Estate", "Consulting", "Education", "Other"];
const TARGET_AUDIENCES = ["Startup (Idea/Seed)", "Small Business (SME)", "Growing Business", "Enterprise", "Investors", "Internal Use", "Non-Profit"];
const LANGUAGES = ["Español", "English", "Português", "Français", "Deutsch"];

// --- Función Auxiliar para Icono ---
const getIconForType = (type: string): string => {
  switch (type) {
    case "Business Plan": return "ri-file-list-3-line";
    case "Excel Template": return "ri-file-excel-2-line";
    case "Marketing Plan": return "ri-megaphone-line";
    default: return "ri-file-line";
  }
};

export default function UploadForm() {
  // --- Estados Existentes ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedType, setSelectedType] = useState<string>(PRODUCT_TYPES[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- NUEVO: Estados para estimaciones ---
  const [estInitialInvestment, setEstInitialInvestment] = useState<string>('');
  const [estProfitMargin, setEstProfitMargin] = useState<string>('');
  const [estPaybackPeriod, setEstPaybackPeriod] = useState<string>('');
  // --- Fin nuevos estados ---


  // --- Handlers (sin cambios) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { setSelectedFile(e.target.files[0]); } else { setSelectedFile(null); }
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { setSelectedImageFile(e.target.files[0]); } else { setSelectedImageFile(null); }
  };

  // --- handleSubmit (ACTUALIZADO para incluir nuevas estimaciones) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validaciones básicas
    if (!selectedFile) { setError('Por favor, selecciona el archivo principal.'); setLoading(false); return; }
    const numericPrice = parseFloat(price);
    if (!title || !description || !selectedType || isNaN(numericPrice) || numericPrice < 0) { setError('Por favor, completa título, descripción, tipo y precio válidos.'); setLoading(false); return; }

    let imageUrlToSave: string | null = null;
    let mainFilePath: string | null = null;
    let imagePathToDeleteOnError: string | null = null;
    let mainPathToDeleteOnError: string | null = null;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) { throw new Error(sessionError?.message || 'No session found.'); }
      const userId = session.user.id;

      // Subir Archivo Principal
      mainPathToDeleteOnError = `${userId}/${Date.now()}_${selectedFile.name}`;
      const { data: mainStorageData, error: mainStorageError } = await supabase.storage.from('product-files').upload(mainPathToDeleteOnError, selectedFile, { upsert: false });
      if (mainStorageError) throw mainStorageError;
      mainFilePath = mainStorageData.path;

      // Subir Imagen
      if (selectedImageFile) {
        const imageExtension = selectedImageFile.name.split('.').pop();
        const imageName = `preview_${Date.now()}.${imageExtension}`;
        imagePathToDeleteOnError = `${userId}/${imageName}`;
        const { data: imageStorageData, error: imageStorageError } = await supabase.storage.from('product-files').upload(imagePathToDeleteOnError, selectedImageFile, { upsert: false });
        if (imageStorageError) throw imageStorageError;
        const { data: publicUrlData } = supabase.storage.from('product-files').getPublicUrl(imagePathToDeleteOnError);
        imageUrlToSave = publicUrlData?.publicUrl || null;
      }

      // Determinar Icono
      const typeIcon = getIconForType(selectedType);

      // --- Guardado en Base de Datos (Añadimos estimaciones) ---
      const productDataToInsert = {
        title: title, description: description, price: numericPrice, type: selectedType, typeIcon: typeIcon,
        file_path: mainFilePath, user_id: userId, image_url: imageUrlToSave,
        industry: industry || null, target_audience: targetAudience || null, language: language || null,
        // --- NUEVO: Añadimos campos de estimaciones (guardamos null si están vacíos) ---
        est_initial_investment: estInitialInvestment || null,
        est_profit_margin: estProfitMargin || null,
        est_payback_period: estPaybackPeriod || null,
        // Faltan related_software, tags (opcionales) que añadiremos si quieres después
      };
      console.log('Datos a insertar en DB:', productDataToInsert);

      const { error: dbError } = await supabase.from('products').insert([productDataToInsert]);
      if (dbError) { throw dbError; }
      console.log('Producto guardado en DB');

      alert('¡Producto subido y guardado con éxito!');
      // Limpiar formulario
      setTitle(''); setDescription(''); setPrice(''); setSelectedType(PRODUCT_TYPES[0]);
      setIndustry(''); setTargetAudience(''); setLanguage(LANGUAGES[0]);
      setEstInitialInvestment(''); setEstProfitMargin(''); setEstPaybackPeriod(''); // Limpiar nuevos estados
      setSelectedFile(null); setSelectedImageFile(null);
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement; if (fileInput) fileInput.value = '';
      const imageInput = document.getElementById('imageUpload') as HTMLInputElement; if (imageInput) imageInput.value = '';

    } catch (error: any) {
      console.error("Error during upload/save:", error);
      setError(`Error: ${error.message || 'An unknown error occurred.'}`);
      // Limpieza Storage
      if (mainPathToDeleteOnError) { await supabase.storage.from('product-files').remove([mainPathToDeleteOnError]); }
      if (imagePathToDeleteOnError) { await supabase.storage.from('product-files').remove([imagePathToDeleteOnError]); }
    } finally {
      setLoading(false);
    }
  };


  // --- JSX del Formulario (Actualizado con nuevos Inputs de Texto para Estimaciones) ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-4 border rounded-lg shadow-sm">
      {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm">Error: {error}</p>}

      {/* Título, Descripción, Tipo, Selects (Sin cambios) */}
      <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título:</label><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"/></div>
      <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={loading} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"/></div>
      <div><label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label><select id="type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} required disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100">{PRODUCT_TYPES.map(o => (<option key={o} value={o}>{o}</option>))}</select></div>
      <div><label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industria/Rubro (Opcional):</label><select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100"><option value="">-- Selecciona --</option>{INDUSTRIES.map(o => (<option key={o} value={o}>{o}</option>))}</select></div>
      <div><label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">Audiencia Objetivo (Opcional):</label><select id="targetAudience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100"><option value="">-- Selecciona --</option>{TARGET_AUDIENCES.map(o => (<option key={o} value={o}>{o}</option>))}</select></div>
      <div><label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma:</label><select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} required disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100">{LANGUAGES.map(o => (<option key={o} value={o}>{o}</option>))}</select></div>
      <div><label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio ($):</label><input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" disabled={loading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"/></div>

      {/* --- NUEVO: Campos Estimaciones Financieras (Opcionales, tipo texto) --- */}
      <div>
        <label htmlFor="estInitialInvestment" className="block text-sm font-medium text-gray-700 mb-1">Inversión Inicial Estimada (Ej: $10k-50k):</label>
        <input
          type="text" // Texto para permitir rangos/descripciones
          id="estInitialInvestment"
          value={estInitialInvestment}
          onChange={(e) => setEstInitialInvestment(e.target.value)}
          disabled={loading}
          placeholder="Ej: $10,000 - $50,000 o N/A"
          // Clases de Tailwind básicas para inputs
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
        />
      </div>
      <div>
        <label htmlFor="estProfitMargin" className="block text-sm font-medium text-gray-700 mb-1">Margen de Ganancia Proyectado (Ej: 15-25%):</label>
        <input
          type="text"
          id="estProfitMargin"
          value={estProfitMargin}
          onChange={(e) => setEstProfitMargin(e.target.value)}
          disabled={loading}
          placeholder="Ej: 20% o Según Modelo"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
        />
      </div>
      <div>
        <label htmlFor="estPaybackPeriod" className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Recuperación Estimado (Ej: 6-12 meses):</label>
        <input
          type="text"
          id="estPaybackPeriod"
          value={estPaybackPeriod}
          onChange={(e) => setEstPaybackPeriod(e.target.value)}
          disabled={loading}
          placeholder="Ej: 18 meses o N/A"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
        />
      </div>
      {/* --- Fin Nuevos Campos --- */}


      {/* Campos de Archivos */}
      <div>
        <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">Archivo Principal (PDF, Excel, etc.):</label>
        <input type="file" id="fileUpload" onChange={handleFileChange} required disabled={loading} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50"/>
        {selectedFile && <p className="mt-1 text-xs text-gray-500">Seleccionado: {selectedFile.name}</p>}
      </div>
      <div>
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">Imagen de Vista Previa (Opcional):</label>
        <input type="file" id="imageUpload" onChange={handleImageFileChange} disabled={loading} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"/>
        {selectedImageFile && <p className="mt-1 text-xs text-gray-500">Imagen seleccionada: {selectedImageFile.name}</p>}
      </div>

      {/* Botón Submit */}
      <div className="pt-2">
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Subiendo...' : 'Subir Producto'}
        </button>
      </div>
    </form>
  );
}