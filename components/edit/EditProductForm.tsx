'use client';

import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { type User } from 'firebase/auth';
import { type Product } from '@/types';
import { SHARK_MARKET_CATEGORIES } from '@/lib/product-categories'; 
import { updateProductAction } from '@/app/actions/product.actions';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const dataToSend = new FormData();
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Añadimos los IDs al paquete de datos
        dataToSend.append('userId', currentUser.uid);
        dataToSend.append('productId', product.id!);
        
        // Añadimos el resto de los datos del formulario
        Object.entries(formData).forEach(([key, value]) => {
            dataToSend.append(key, String(value));
        });

        if (newPreviewImage) {
            dataToSend.append('newPreviewImage', newPreviewImage);
        }

        // Llamamos a la acción con un solo argumento, como ahora espera
        const promise = updateProductAction(dataToSend).then(result => {
        // --- FIN DE LA CORRECCIÓN ---
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

        <div>
            <label htmlFor="newPreviewImage" className={labelStyle}>Cambiar Imagen de Portada (Opcional)</label>
            <div className="mt-2 flex items-center gap-x-4">
                <div className="h-24 w-24 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center border">
                    {imagePreviewUrl ? (
                        <Image src={imagePreviewUrl} alt="Vista previa" width={96} height={96} className="h-full w-full object-cover rounded-md" />
                    ) : (
                        <UploadCloud className="h-8 w-8 text-slate-400" />
                    )}
                </div>
                <input 
                    type="file" 
                    id="newPreviewImage" 
                    name="newPreviewImage" 
                    accept="image/jpeg, image/png, image/webp" 
                    onChange={handleImageChange} 
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/10 file:text-orange-600 hover:file:bg-orange-500/20 cursor-pointer"
                />
            </div>
        </div>
        
        <div className="pt-5 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className={buttonStyle}>
                {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
        </div>
      </form>
    );
};