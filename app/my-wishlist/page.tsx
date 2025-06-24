// --- ARCHIVO FINAL Y CORREGIDO: app/my-wishlist/page.tsx ---
// CORRECCIÓN: Se actualiza la ruta de importación para el tipo 'Product'.
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

// Esta importación ya estaba bien, la mantenemos.
import { fetchWishlistProductsAction } from '@/app/wishlist/actions';
// ---> CORRECCIÓN: Apuntamos a nuestro archivo central de tipos.
import { type Product } from '@/types';

import ProductCard from '@/components/ProductCard';

export default function MyWishlistPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadWishlist = useCallback(async (userId: string) => {
        setIsLoading(true);
        try {
            const result = await fetchWishlistProductsAction(userId);
            if (result.success && result.data) {
                // Aseguramos que todos los productos tengan isWishlisted = true
                const products = result.data.map(p => ({ ...p, isWishlisted: true }));
                setWishlistedProducts(products);
            } else {
                toast.error(result.message || "No se pudo cargar tu lista de favoritos.");
            }
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                setCurrentUser(userAuth);
                loadWishlist(userAuth.uid);
            } else {
                setCurrentUser(null);
                setWishlistedProducts([]);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [loadWishlist]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="animate-pulse text-slate-500">Cargando tus favoritos...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Acceso Requerido</h2>
                    <p className="text-slate-600 mt-2 mb-6">Debes iniciar sesión para ver tus favoritos.</p>
                    <Link href="/login" className="inline-block px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <h1 className="font-serif text-4xl font-bold text-slate-800">Mis Favoritos</h1>
                <p className="mt-2 text-lg text-slate-500">Tus plantillas e intereses guardados. ¡No los pierdas de vista!</p>

                <div className="mt-10">
                    {wishlistedProducts.length === 0 ? (
                        <div className="text-center py-16 px-6 border-2 border-dashed border-slate-300 rounded-lg bg-white">
                             <h2 className="text-2xl font-bold text-slate-800">Tu lista de favoritos está vacía</h2>
                            <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">Haz clic en el corazón de los productos que te interesen para guardarlos aquí.</p>
                            <Link href="/search" className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent-hover transition-transform duration-300 hover:scale-105">
                                Explorar Productos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistedProducts.map((product) => (
                                <ProductCard
                                    key={product.id!}
                                    id={product.id!}
                                    isWishlisted={true}
                                    image_url={product.previewImageURL}
                                    title={product.title}
                                    price={product.price}
                                    category={product.category}
                                    detailUrl={`/product/${product.id}`} 
                                    altText={`Imagen de ${product.title}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}