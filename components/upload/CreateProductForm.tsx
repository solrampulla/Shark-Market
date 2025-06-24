// --- ARCHIVO FINAL Y CORREGIDO: components/upload/CreateProductForm.tsx ---
'use client';

import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

// ---> CORRECCIÓN 1: Se actualizan TODAS las rutas de importación.
import { createProductAction } from '@/app/actions/product.actions';
import { CATEGORIES, INDUSTRIES, PRODUCT_TYPES } from '@/lib/constants'; // Usamos los nombres correctos
import { type Product } from '@/types';

// Asumo que estos componentes existen por el código que me pasaste antes
// Si no, avísame y te ayudo a crearlos o simplificamos el JSX.
import FileUploadZone from './FileUploadZone';
import FilePreview from './FilePreview';

export default function CreateProductForm() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        // ---> CORRECCIÓN 2: Usamos los valores correctos de las constantes
        category: CATEGORIES[0]?.value || '',
        type: PRODUCT_TYPES[0]?.value || '',
        industry: INDUSTRIES[0]?.value || '',
        language: 'Español', // Mantenemos un valor por defecto simple
        price: '',
    });
    
    const [productFiles, setProductFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
            setPreviewImageUrl(URL.createObjectURL(file));
        }
    };
    const removeProductFile = (fileToRemove: File) => {
        setProductFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };
    const removePreviewImage = () => {
        setPreviewImage(null);
        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
        setPreviewImageUrl(null);
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
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
        
        Object.entries(formData).forEach(([key, value]) => {
            dataToSend.append(key, value);
        });
        
        dataToSend.append('previewImage', previewImage);
        productFiles.forEach(file => {
            dataToSend.append('files', file);
        });

        // Usamos toast.promise para una mejor UX
        const promise = createProductAction(dataToSend).then(result => {
            if (!result.success) throw new Error(result.message);
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
    
    // ... (El JSX permanece igual, pero ahora las constantes y acciones funcionarán)
    return (
      <form onSubmit={handleSubmit} className="space-y-8">
            {/* ... Tu JSX aquí ... */}
      </form>
    );
};