// app/my-products/edit/[productId]/page.tsx - VERSIÓN CORREGIDA URGENTE
'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getProductDetailsForDisplayAction } from '@/app/actions/product.actions';
import { type Product } from '@/types';
import EditProductForm from '@/components/edit/EditProductForm'; // Importamos el formulario de edición
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage({ params }: { params: { productId: string } }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                setCurrentUser(userAuth);
                try {
                    const productResult = await getProductDetailsForDisplayAction(params.productId);
                    if (productResult.success && productResult.product) {
                        // Verificamos que el usuario es el dueño del producto
                        if (productResult.product.sellerId !== userAuth.uid) {
                            setError("No tienes permiso para editar este producto.");
                        } else {
                            setProduct(productResult.product);
                        }
                    } else {
                        setError("Producto no encontrado.");
                    }
                } catch (e) {
                    setError("Error al cargar el producto.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("Debes iniciar sesión para editar productos.");
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [params.productId]);

    if (isLoading) {
        return <div className="text-center p-8"><p className="animate-pulse text-zinc-500">Cargando editor...</p></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!currentUser || !product) {
        return notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="relative text-center mb-10">
                        <Link 
                            href="/my-products" 
                            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-sm font-semibold text-slate-600 hover:text-orange-600"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a Mis Activos
                        </Link>
                        <h1 className="font-serif text-4xl font-bold text-slate-800">
                            Editar Activo
                        </h1>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-lg">
                        {/* --- LA CORRECCIÓN ESTÁ AQUÍ --- */}
                        {/* Pasamos los props con los nombres correctos: 'currentUser' y 'product' */}
                        <EditProductForm currentUser={currentUser} product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}