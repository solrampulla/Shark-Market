// --- ARCHIVO FINAL Y CORREGIDO: components/edit/EditProductForm.tsx ---
'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { updateProductAction } from '@/app/actions/product.actions';
import { type Product } from '@/types';
import { auth } from '@/lib/firebase';
import { CATEGORIES, PRODUCT_TYPES, INDUSTRIES } from '@/lib/constants';

const availableCurrencies = ['USD', 'EUR'];

interface EditFormProps {
  initialData: Product;
}

export default function EditProductForm({ initialData }: EditFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'USD',
        category: '',
        type: '',
        industry: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                price: String(initialData.price || ''),
                currency: initialData.currency || 'USD',
                category: initialData.category || '',
                type: initialData.type || '',
                industry: initialData.industry || '',
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = auth.currentUser;
        if (!user) return toast.error("Debes iniciar sesión para editar.");
        if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
            return toast.error("Por favor, completa todos los campos obligatorios.");
        }

        setIsSubmitting(true);
        const productDataToUpdate = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            currency: formData.currency,
            category: formData.category,
            type: formData.type,
            industry: formData.industry,
        };
        
        const result = await updateProductAction(user.uid, initialData.id!, productDataToUpdate);

        if (result.success) {
            toast.success(result.message);
            router.push('/my-products');
            router.refresh();
        } else {
            toast.error(result.message);
        }
        setIsSubmitting(false);
    };

    const labelStyle = "block text-sm font-semibold text-zinc-700 mb-2";
    const inputStyle = "block w-full px-4 py-2.5 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 sm:text-sm bg-white text-zinc-900 disabled:bg-zinc-50";
    const buttonStyle = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed";

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="title" className={labelStyle}>Título del Producto <span className="text-red-500">*</span></label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className={inputStyle} disabled={isSubmitting} />
        </div>
        <div>
            <label htmlFor="description" className={labelStyle}>Descripción <span className="text-red-500">*</span></label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={4} className={inputStyle} disabled={isSubmitting} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className={labelStyle}>Precio <span className="text-red-500">*</span></label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required className={inputStyle} placeholder="Ej: 29.99" step="0.01" min="0" disabled={isSubmitting} />
            </div>
            <div>
                <label htmlFor="currency" className={labelStyle}>Moneda</label>
                <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange} className={inputStyle} disabled={isSubmitting}>
                    {availableCurrencies.map((curr) => <option key={curr} value={curr}>{curr}</option>)}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label htmlFor="category" className={labelStyle}>Categoría <span className="text-red-500">*</span></label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} required className={inputStyle} disabled={isSubmitting}>
                    {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="type" className={labelStyle}>Tipo <span className="text-red-500">*</span></label>
                <select id="type" name="type" value={formData.type} onChange={handleInputChange} required className={inputStyle} disabled={isSubmitting}>
                    {PRODUCT_TYPES.map((prodType) => <option key={prodType.value} value={prodType.value}>{prodType.label}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="industry" className={labelStyle}>Industria <span className="text-red-500">*</span></label>
                <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} required className={inputStyle} disabled={isSubmitting}>
                    {INDUSTRIES.map((ind) => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
                </select>
            </div>
        </div>
        <div className="p-4 bg-zinc-100 rounded-lg text-sm text-zinc-600">
            <p className="flex items-start gap-x-2"><span>ℹ️</span><span>La edición de archivos (imágenes y de producto) no está incluida. Para cambiarlos, es necesario borrar y volver a crear el producto.</span></p>
        </div>
        <div className="pt-6 border-t border-zinc-200">
            <button type="submit" disabled={isSubmitting} className={buttonStyle}>
                {isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
            </button>
        </div>
      </form>
    );
}