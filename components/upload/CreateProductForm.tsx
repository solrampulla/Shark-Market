// components/upload/CreateProductForm.tsx - VERSIÓN FINAL CON NUEVAS CATEGORÍAS
'use client';

import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { type User } from 'firebase/auth';

import { createProductAction } from '@/app/actions/product.actions';
// --- INICIO DE LA CORRECCIÓN ---
// Importamos la nueva lista de categorías y eliminamos las antiguas
import { SHARK_MARKET_CATEGORIES } from '@/lib/product-categories';
// --- FIN DE LA CORRECCIÓN ---

import FileUploadZone from './FileUploadZone';
import FilePreview from './FilePreview';

interface CreateProductFormProps {
  currentUser: User;
}

export default function CreateProductForm({ currentUser }: CreateProductFormProps) {
    const router = useRouter();
    
    // Simplificamos el estado del formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: SHARK_MARKET_CATEGORIES[0]?.value || '', // Valor por defecto
        price: '',
    });
    
    const [productFiles, setProductFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductFilesChange = (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.filter(newFile => !productFiles.some(existingFile => existingFile.name === newFile.name));
        setProductFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handlePreviewImageChange = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setPreviewImage(file);
        }
    };

    const removeProductFile = (fileToRemove: File) => {
        setProductFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    const removePreviewImage = () => {
        setPreviewImage(null);
    };

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("Debes iniciar sesión para publicar un producto.");
            return;
        }
        if (productFiles.length === 0 || !previewImage) {
            toast.error("Por favor, sube una imagen de portada y al menos un archivo de producto.");
            return;
        }
        setIsLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('userId', currentUser.uid);
        
        // El formulario ahora es más simple, así que se añaden menos campos
        Object.entries(formData).forEach(([key, value]) => {
            dataToSend.append(key, value);
        });
        
        dataToSend.append('previewImage', previewImage);
        productFiles.forEach(file => {
            dataToSend.append('files', file);
        });

        const promise = createProductAction(dataToSend).then(result => {
            if (!result.success) throw new Error(result.message || "Error desconocido");
            router.push('/my-products');
            router.refresh();
            return result.message;
        });

        toast.promise(promise, {
            loading: 'Publicando tu producto...',
            success: (message) => `${message}`,
            error: (err) => `Error: ${err.message}`,
            finally: () => setIsLoading(false),
        });
    };
    
    const labelStyle = "block text-sm font-semibold text-slate-700 mb-2";
    const inputStyle = "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm";
    const buttonStyle = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed";

    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="title" className={labelStyle}>Título del Producto</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className={inputStyle} placeholder="Ej: Plantilla de Proyecciones Financieras para SaaS" />
        </div>

        <div>
          <label htmlFor="description" className={labelStyle}>Descripción</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} required rows={4} className={inputStyle} placeholder="Describe qué es, para quién es y qué problemas soluciona."></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className={labelStyle}>Precio (USD)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required className={inputStyle} placeholder="Ej: 29.99" step="0.01" min="0" />
            </div>
            {/* --- INICIO DE LA CORRECCIÓN --- */}
            {/* Este es ahora el único menú desplegable para la categorización */}
            <div>
                <label htmlFor="category" className={labelStyle}>Categoría</label>
                <select name="category" id="category" value={formData.category} onChange={handleInputChange} className={inputStyle}>
                    {SHARK_MARKET_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
            </div>
            {/* Se eliminan los campos 'type' e 'industry' */}
            {/* --- FIN DE LA CORRECCIÓN --- */}
        </div>
        
        <div>
          <label className={labelStyle}>Imagen de Portada</label>
          <FileUploadZone onFileChange={handlePreviewImageChange} singleFile={true} />
          {previewImage && <FilePreview file={previewImage} onRemove={removePreviewImage} />}
        </div>
        
        <div>
            <label className={labelStyle}>Archivos del Producto (lo que el cliente descargará)</label>
            <FileUploadZone onFileChange={handleProductFilesChange} />
            <div className="mt-4 space-y-2">
                {productFiles.map((file, index) => (
                    <FilePreview key={index} file={file} onRemove={() => removeProductFile(file)} />
                ))}
            </div>
        </div>

        <div className="pt-5 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className={buttonStyle}>
                {isLoading ? 'Publicando...' : 'Publicar Producto'}
            </button>
        </div>
      </form>
    );
};