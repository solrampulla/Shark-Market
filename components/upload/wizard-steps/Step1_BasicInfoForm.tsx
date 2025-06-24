// --- ARCHIVO ACTUALIZADO: components/upload/wizard-steps/Step1_BasicInfoForm.tsx ---
// CAMBIO: Se añade un campo para subir la imagen de portada.
'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORIES, INDUSTRIES, PRODUCT_TYPES } from '@/lib/constants';
import { UploadCloud } from 'lucide-react';

interface BasicInfoData {
  title: string;
  description: string;
  price: number | string;
  category: string;
  industry: string;
  type: string;
}

interface Step1Props {
  data: BasicInfoData;
  onDataChange: (field: keyof BasicInfoData, value: string | number) => void;
  previewImage: File | null;
  onPreviewImageChange: (file: File | null) => void;
}

export default function Step1_BasicInfoForm({ data, onDataChange, previewImage, onPreviewImageChange }: Step1Props) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    onDataChange(name as keyof BasicInfoData, type === 'number' ? parseFloat(value) || '' : value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPreviewImageChange(e.target.files ? e.target.files[0] : null);
  }
  
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputStyle = "block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";

  return (
    <div className="space-y-6">
      {/* ... (Los campos de Título y Descripción no cambian) ... */}
       <div>
        <label htmlFor="title" className={labelStyle}>Título del Producto *</label>
        <input type="text" name="title" id="title" value={data.title} onChange={handleInputChange} className={inputStyle} placeholder="Ej: Plan de Negocio para Startup SaaS" required />
      </div>
      <div>
        <label htmlFor="description" className={labelStyle}>Descripción Corta *</label>
        <textarea name="description" id="description" value={data.description} onChange={handleInputChange} rows={3} className={inputStyle} placeholder="Describe en pocas frases de qué trata tu producto y qué problema soluciona." required />
      </div>

      {/* ---> NUEVO: Campo para la imagen de portada */}
      <div>
        <label htmlFor="previewImage" className={labelStyle}>Imagen de Portada *</label>
        <div className="mt-2 flex items-center gap-x-3">
          <div className="h-24 w-24 bg-slate-100 rounded-md flex items-center justify-center border">
            {previewImage ? (
                <Image src={URL.createObjectURL(previewImage)} alt="Vista previa" width={96} height={96} className="h-full w-full object-cover rounded-md" />
            ) : (
                <UploadCloud className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <input type="file" id="previewImage" name="previewImage" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
        {/* ... (Los campos de Precio, Categoría, etc. no cambian) ... */}
         <div>
            <label htmlFor="price" className={labelStyle}>Precio (USD) *</label>
            <input type="number" name="price" id="price" value={data.price} onChange={handleInputChange} className={inputStyle} placeholder="49.99" required min="0" step="0.01" />
        </div>
        <div>
            <label htmlFor="category" className={labelStyle}>Categoría *</label>
            <select name="category" id="category" value={data.category} onChange={handleInputChange} className={inputStyle} required>
                <option value="" disabled>Selecciona una categoría</option>
                {CATEGORIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="industry" className={labelStyle}>Industria *</label>
            <select name="industry" id="industry" value={data.industry} onChange={handleInputChange} className={inputStyle} required>
                <option value="" disabled>Selecciona una industria</option>
                {INDUSTRIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="type" className={labelStyle}>Tipo de Producto *</label>
            <select name="type" id="type" value={data.type} onChange={handleInputChange} className={inputStyle} required>
                <option value="" disabled>Selecciona un tipo</option>
                {PRODUCT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
      </div>
    </div>
  );
}