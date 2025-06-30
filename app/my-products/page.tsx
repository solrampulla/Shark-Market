// --- ARCHIVO FINAL Y CORREGIDO: app/my-products/page.tsx ---
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { fetchSellerProductsAction, deleteProductAction } from '@/app/actions/product.actions';
import { getUserProfileRoleAction } from '@/app/actions/user.actions';
import { type Product } from '@/types';
import Link from 'next/link';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard'; 

export default function MyProductsPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async (user: User) => {
        setIsLoading(true);
        try {
            const productsResult = await fetchSellerProductsAction(user.uid);
            if (!productsResult.success || !productsResult.data) {
                throw new Error(productsResult.message || "No se pudieron cargar tus productos.");
            }
            setProducts(productsResult.data);
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
                const roleResult = await getUserProfileRoleAction(userAuth.uid);
                if (roleResult.role === 'seller') {
                    await loadData(userAuth);
                } else {
                    toast.error("Solo los vendedores pueden acceder a esta página.");
                    setIsLoading(false);
                }
            } else {
                setCurrentUser(null);
                setProducts([]);
                toast.error("Debes iniciar sesión para ver tus productos.");
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [loadData]);

    const executeDeletion = (productId: string) => {
        if (!currentUser) return;
        const promise = deleteProductAction(currentUser.uid, productId)
            .then(result => {
                if (result.success) {
                    loadData(currentUser); 
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            });
        toast.promise(promise, {
            loading: 'Borrando producto...',
            success: (message) => `${message}`,
            error: (err) => `Error: ${err.message}`,
        });
    }

    const handleDeleteProduct = (productId: string, productTitle: string) => {
        if (!currentUser) return toast.error("Debes estar autenticado.");
        toast.warning(`¿Seguro que quieres borrar "${productTitle}"?`, {
            action: { label: 'Confirmar Borrado', onClick: () => executeDeletion(productId) },
            cancel: { label: 'Cancelar', onClick: () => {} },
            duration: 10000,
        });
    };

    if (isLoading) {
        return <div className="text-center p-8"><p className="animate-pulse text-zinc-500">Cargando tus productos...</p></div>;
    }
    
    const validProducts = products.filter(p => p.id);

    return (
        <div className="bg-zinc-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
                    <div>
                    {/* --- ESTILOS REFINADOS --- */}
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Mis Activos</h1>
                        <p className="mt-2 text-lg text-zinc-600">Gestiona las herramientas y estrategias que has puesto a la venta.</p>
                    </div>
                    <Link href="/upload" className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap self-start sm:self-center">
                        Publicar Nuevo Activo
                    </Link>
                </div>
                
                {validProducts.length === 0 ? (
                    <div className="text-center py-16 px-6 border-2 border-dashed border-zinc-300 rounded-lg bg-white">
                        <h2 className="text-2xl font-bold text-zinc-800">Aún no tienes activos a la venta</h2>
                        <p className="text-zinc-500 mt-2 mb-6 max-w-md mx-auto">¡Empieza a monetizar tu conocimiento! Publica tu primera herramienta para que miles de emprendedores puedan encontrarla.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {validProducts.map(product => (
                            <ProductCard
                                key={product.id!}
                                product={product}
                                editUrl={`/my-products/edit/${product.id}`}
                                // --- CORRECCIÓN: Pasamos la función correcta al onDelete ---
                                onDelete={() => handleDeleteProduct(product.id!, product.title)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}