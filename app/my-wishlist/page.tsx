'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
// Asumimos que tienes una acción para obtener la wishlist, si no, habría que crearla
// Por ahora, usaremos un placeholder. La estructura es lo importante.
// import { getWishlistAction } from '@/app/actions/user.actions'; 
import { type Product } from '@/types';
import Link from 'next/link';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard'; 

// Placeholder hasta que tengamos la acción real
const getWishlistAction = async (userId: string): Promise<{ success: boolean, data?: Product[], message?: string }> => {
    console.log("getWishlistAction no implementada, devolviendo array vacío.", userId);
    return { success: true, data: [] };
}


export default function MyWishlistPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async (user: User) => {
        setIsLoading(true);
        try {
            const wishlistResult = await getWishlistAction(user.uid);
            if (!wishlistResult.success || !wishlistResult.data) {
                throw new Error(wishlistResult.message || "No se pudo cargar tu lista de deseos.");
            }
            setProducts(wishlistResult.data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                setCurrentUser(userAuth);
                await loadData(userAuth);
            } else {
                setCurrentUser(null);
                setProducts([]);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [loadData]);


    if (isLoading) {
        return <div className="text-center p-8"><p className="animate-pulse text-zinc-500">Cargando tu lista de deseos...</p></div>;
    }

    if (!currentUser) {
        return (
            <div className="text-center py-16 px-6 border-2 border-dashed border-slate-300 rounded-lg bg-white max-w-2xl mx-auto mt-12">
                <h2 className="text-2xl font-bold text-slate-800">Acceso Restringido</h2>
                <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">Debes iniciar sesión para ver esta página.</p>
                <Link href="/login" className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600">
                    Iniciar Sesión
                </Link>
            </div>
        );
    }
    
    return (
        <div className="bg-zinc-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Mi Lista de Deseos</h1>
                    <p className="mt-2 text-lg text-zinc-600">Tus herramientas y estrategias guardadas para el futuro.</p>
                </div>
                
                {products.length === 0 ? (
                    <div className="text-center py-16 px-6 border-2 border-dashed border-zinc-300 rounded-lg bg-white">
                        <h2 className="text-2xl font-bold text-zinc-800">Tu lista de deseos está vacía</h2>
                        <p className="text-zinc-500 mt-2 mb-6 max-w-md mx-auto">Explora el mercado y guarda los productos que te interesen para encontrarlos fácilmente.</p>
                         <Link href="/search" className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600">
                            Explorar Herramientas
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                        {/* --- INICIO DE LA CORRECCIÓN --- */}
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id!}
                                product={product}
                                index={index}
                            />
                        ))}
                        {/* --- FIN DE LA CORRECCIÓN --- */}
                    </div>
                )}
            </div>
        </div>
    );
}