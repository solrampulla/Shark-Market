'use client';

import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { type User } from 'firebase/auth';
import { type Product } from '@/types';
import { SHARK_MARKET_CATEGORIES } from '@/lib/product-categories'; 
import { updateProductAction } from '@/app/actions/product.actions';

interface EditProductFormProps {
  currentUser: User;
  product: Product;
}

export default function EditProductForm({ currentUser, product }: EditProductFormProps) {
    const router = useRouter();
    
    // El estado ahora solo contiene los campos que el formulario realmente edita
    const [formData, setFormData] = useState({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
    });
    
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Creamos el objeto de datos solo con lo que ha cambiado.
        // Aseguramos que el precio sea un número.
        const dataToUpdate = {
            ...formData,
            price: Number(formData.price),
        };

        const promise = updateProductAction(currentUser.uid, product.id!, dataToUpdate).then(result => {
            if (!result.success) throw new Error(result.message || "Error desconocido");
            router.push('/my-products');
            router.refresh();
            return result.message;
        });

        toast.promise(promise, {
            loading: 'Actualizando tu producto...',
            success: (message) => `Éxito: ${message}`,
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
        
        <div className="pt-5 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className={buttonStyle}>
                {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
        </div>
      </form>
    );
};