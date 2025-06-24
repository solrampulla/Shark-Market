// --- ARCHIVO FINAL Y CORREGIDO: app/my-purchases/page.tsx ---
// CORRECCIÓN: Se actualizan las rutas de importación para los tipos y las acciones.
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

// ---> CORRECCIÓN: Apuntamos a las nuevas ubicaciones correctas
import { fetchUserPurchasesAction } from '@/app/actions/user.actions';
import { type PurchasedProductEntry } from '@/types';


export default function MyPurchasesPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [purchases, setPurchases] = useState<PurchasedProductEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadPurchases = useCallback(async (userId: string) => {
        setIsLoading(true);
        const result = await fetchUserPurchasesAction(userId);
        if (result.success && result.data) {
            setPurchases(result.data);
        } else {
            toast.error(result.message || "No se pudieron cargar tus compras.");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                setCurrentUser(userAuth);
                loadPurchases(userAuth.uid);
            } else {
                setCurrentUser(null);
                setPurchases([]);
                setIsLoading(false); 
            }
        });
        return () => unsubscribe();
    }, [loadPurchases]);


    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="animate-pulse text-slate-500">Cargando tus compras...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Acceso Requerido</h2>
                    <p className="text-slate-600 mt-2 mb-6">Debes iniciar sesión para ver tus compras.</p>
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
                <h1 className="font-serif text-4xl font-bold text-slate-800">Mis Compras</h1>
                <p className="mt-2 text-lg text-slate-500">Aquí encontrarás todas las herramientas que has adquirido, listas para descargar.</p>

                <div className="mt-10">
                    {purchases.length === 0 ? (
                        <div className="text-center py-16 px-6 border-2 border-dashed border-slate-300 rounded-lg bg-white">
                            <h2 className="text-2xl font-bold text-slate-800">Tu colección de herramientas está esperando</h2>
                            <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">Cuando compres una plantilla, aparecerá aquí al instante.</p>
                            <Link href="/search" className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent-hover transition-transform duration-300 hover:scale-105">
                                Explorar Plantillas
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {purchases.map((purchase) => (
                                <div key={purchase.id || purchase.purchaseOrderId} className="bg-white p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                    {purchase.previewImageURL && (
                                        <div className="w-32 h-20 flex-shrink-0 relative rounded overflow-hidden bg-slate-100">
                                            <Image
                                                src={purchase.previewImageURL}
                                                alt={purchase.title || 'Imagen del producto'}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 128px, 128px"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-grow text-center sm:text-left">
                                        <h2 className="text-lg font-semibold text-slate-800">{purchase.title}</h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Comprado el: {new Date(purchase.purchaseGrantedAt).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-4 sm:ml-auto">
                                        <Link href={`/product/${purchase.id}`} className="text-sm font-semibold text-accent hover:underline">
                                            Ver Producto
                                        </Link>
                                        <a 
                                            href={purchase.fileURL} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-md whitespace-nowrap transition"
                                        >
                                            Descargar
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}