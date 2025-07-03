'use client';

import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { type User } from 'firebase/auth';
import { type Product, type ProductFile } from '@/types'; // Se añade ProductFile
import { SHARK_MARKET_CATEGORIES } from '@/lib/product-categories'; 
import { updateProductAction } from '@/app/actions/product.actions';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';
// Importamos los componentes de subida de archivos que ya usamos en el otro formulario
import FileUploadZone from '../upload/FileUploadZone';
import FilePreview from '../upload/FilePreview';

interface EditProductFormProps {
  currentUser: User;
  product: Product;
}

export default function EditProductForm({ currentUser, product }: EditProductFormProps) {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
    });
    
    const [newPreviewImage, setNewPreviewImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(product.previewImageURL || null);

    // --- INICIO DE LA CORRECCIÓN ---
    // Nuevo estado para manejar los archivos de producto a reemplazar
    const [newProductFiles, setNewProductFiles] = useState<File[]>([]);
    // --- FIN DE LA CORRECCIÓN ---

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("La imagen debe ser menor a 2MB.");
                return;
            }
            setNewPreviewImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- INICIO DE LA CORRECCIÓN ---
    // Nuevas funciones para manejar los archivos de producto
    const handleProductFilesChange = (acceptedFiles: File[]) => {
        const currentFiles = [...acceptedFiles];
        setNewProductFiles(currentFiles); // Reemplazamos los archivos anteriores por los nuevos
        if (currentFiles.length > 0) {
          toast.info(`${currentFiles.length} archivo(s) nuevo(s) seleccionado(s). Se reemplazarán los anteriores al guardar.`);
        }
    };

    const removeNewProductFile = (fileToRemove: File) => {
        setNewProductFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };
    // --- FIN DE LA CORRECCIÓN ---

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('userId', currentUser.uid);
        dataToSend.append('productId', product.id!);
        
        Object.entries(formData).forEach(([key, value]) => {
            dataToSend.append(key, String(value));
        });

        if (newPreviewImage) {
            dataToSend.append('newPreviewImage', newPreviewImage);
        }

        // --- INICIO DE LA CORRECCIÓN ---
        // Añadimos los nuevos archivos de producto al formulario
        if (newProductFiles.length > 0) {
            newProductFiles.forEach(file => {
                dataToSend.append('newProductFiles', file);
            });
        }
        // --- FIN DE LA CORRECCIÓN ---

        const promise = updateProductAction(dataToSend).then(result => {
            if (!result.success) throw new Error(result.message || "Error desconocido");
            router.push('/my-products');
            router.refresh();
            return "Producto actualizado con éxito.";
        });

        toast.promise(promise, {
            loading: 'Actualizando tu producto...',
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
        {/* ... (campos de título, descripción, precio, categoría) ... */}
        <div>
          <label htmlFor="title" className={labelStyle}>Título del Producto</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className={inputStyle} />
        </div>
        <div>
          <label htmlFor="description" className={labelStyle}>Descripción</label>
          <textarea name="description" id="description" value={formData.description || ''} onChange={handleInputChange} required rows={4} className={inputStyle}></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className={labelStyle}>Precio (USD)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required className={inputStyle} step="0.01" min="0" />
            </div>
            <div>
                <label htmlFor="category" className={labelStyle}>Categoría</label>
                <select name="category" id="category" value={formData.category} onChange={handleInputChange} className={inputStyle}>
                    {SHARK_MARKET_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
            </div>
        </div>
        
        {/* Campo para editar imagen de portada */}
        <div>
            <label className={labelStyle}>Cambiar Imagen de Portada (Opcional)</label>
            <div className="mt-2 flex items-center gap-x-4">
                <div className="h-24 w-24 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center border">
                    {imagePreviewUrl ? (
                        <Image src={imagePreviewUrl} alt="Vista previa" width={96} height={96} className="h-full w-full object-cover rounded-md" />
                    ) : ( <UploadCloud className="h-8 w-8 text-slate-400" /> )}
                </div>
                <input type="file" onChange={handleImageChange} accept="image/jpeg, image/png, image/webp" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-600 hover:file:bg-orange-500/20 cursor-pointer"/>
            </div>
        </div>

        {/* --- INICIO DE LA CORRECCIÓN --- */}
        {/* Nueva sección para reemplazar los archivos del producto */}
        <div className="border-t pt-8">
            <label className={labelStyle}>Reemplazar Archivos del Producto (Opcional)</label>
            <p className="text-xs text-slate-500 mb-2">Si subes nuevos archivos aquí, los archivos anteriores se borrarán y reemplazarán por completo.</p>
            <FileUploadZone onFileChange={handleProductFilesChange} />
            <div className="mt-4 space-y-2">
                {newProductFiles.length > 0 ? (
                    newProductFiles.map((file, index) => (
                        <FilePreview key={index} file={file} onRemove={() => removeNewProductFile(file)} />
                    ))
                ) : (
                    <div className="text-sm text-slate-500">Actualmente se conservarán los archivos originales.</div>
                )}
            </div>
        </div>
        {/* --- FIN DE LA CORRECCIÓN --- */}
        
        <div className="pt-5 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className={buttonStyle}>
                {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
        </div>
      </form>
    );
};