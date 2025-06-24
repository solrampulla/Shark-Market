// --- ARCHIVO FINAL Y CORREGIDO: app/(routes)/search/page.tsx ---
// CORRECCIÓN: Se actualizan las rutas de importación para los tipos y las acciones.
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explorar Productos | Founder Market',
  description: 'Busca y filtra entre cientos de plantillas y herramientas de negocio creadas por expertos.',
};


// ---> CORRECCIÓN: Apuntamos a las nuevas ubicaciones correctas
import { getFilteredProductsAction } from '@/app/actions/product.actions';
import { type Product, type FilterCriteria } from '@/types';

import FilterBar from '@/components/FilterBar';
// Asumo que tienes un componente para mostrar una lista de productos
import ProductList from '@/components/products/ProductList'; 

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-slate-500">Buscando los mejores productos...</p>
    </div>
);

const NoResults = () => (
    <div className="text-center h-64 flex flex-col justify-center items-center bg-white rounded-lg border shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700">No se encontraron resultados</h3>
        <p className="text-slate-500 mt-2">Prueba a cambiar o eliminar algunos filtros para encontrar lo que buscas.</p>
    </div>
);

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const initialFilters: FilterCriteria = {
        q: searchParams.get('q') || '',
        category: searchParams.get('category') || 'all',
        industry: searchParams.get('industry') || 'all',
        type: searchParams.get('type') || 'all',
        sortBy: searchParams.get('sortBy') || 'newest',
    };

    const runSearch = useCallback(async (filters: FilterCriteria) => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.category && filters.category !== 'all') params.set('category', filters.category);
        if (filters.industry && filters.industry !== 'all') params.set('industry', filters.industry);
        if (filters.type && filters.type !== 'all') params.set('type', filters.type);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        // Usamos push en lugar de replace para que el historial del navegador funcione
        router.push(`/search?${params.toString()}`, { scroll: false });

        const result = await getFilteredProductsAction(filters);

        if (result.success && result.data) {
            setProducts(result.data);
        } else {
            toast.error(result.error || "Hubo un problema al buscar los productos.");
            setProducts([]);
        }

        setIsLoading(false);
    }, [router]);
    
    // Este useEffect ahora solo se usa para la carga inicial si la página se carga sin interacción
    useEffect(() => {
        runSearch(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* FilterBar ya es inteligente y llama a runSearch cuando es necesario */}
            <FilterBar initialFilters={initialFilters} onFiltersUpdate={runSearch} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="font-serif text-4xl font-bold text-slate-800">
                        {initialFilters.q ? `Resultados para "${initialFilters.q}"` : "Explorar Productos"}
                    </h1>
                    <p className="mt-2 text-lg text-slate-500">Encuentra las herramientas que necesitas para crecer.</p>
                </div>
                
                <div className="mt-8">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : products.length > 0 ? (
                        // Asumo que tienes un componente ProductList que puede renderizar las tarjetas
                        <ProductList products={products} />
                    ) : (
                        <NoResults />
                    )}
                </div>
            </div>
        </div>
    );
}