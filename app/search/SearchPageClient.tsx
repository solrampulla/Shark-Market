// app/search/SearchPageClient.tsx - VERSIÓN CORREGIDA
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getFilteredProductsAction } from '@/app/actions/product.actions';
import { type Product, type FilterCriteria } from '@/types';
import FilterBar from '@/components/FilterBar';
import ProductList from '@/components/products/ProductList'; 

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-slate-500">Buscando los mejores productos...</p>
    </div>
);

const NoResults = () => (
    <div className="text-center h-64 flex flex-col justify-center items-center bg-white rounded-lg border shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700">No se encontraron resultados</h3>
        <p className="text-slate-500 mt-2">Prueba a cambiar o eliminar algunos filtros para encontrar lo que buscas.</p>
    </div>
);

export default function SearchPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- INICIO DE LA CORRECCIÓN ---
    // Se simplifican los filtros iniciales, eliminando 'industry' y 'type'
    const initialFilters: FilterCriteria = {
        q: searchParams.get('q') || '',
        category: searchParams.get('category') || 'all',
        sortBy: searchParams.get('sortBy') || 'newest',
    };

    const runSearch = useCallback(async (filters: FilterCriteria) => {
        setIsLoading(true);
        const params = new URLSearchParams();
        
        // Se actualiza la forma en que se construyen los parámetros de la URL
        if (filters.q) params.set('q', filters.q);
        if (filters.category && filters.category !== 'all') params.set('category', filters.category);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        
        // Se eliminan los parámetros para 'industry' y 'type'
        router.push(`/search?${params.toString()}`, { scroll: false });

        const result = await getFilteredProductsAction(filters);
        if (result.success && result.data) {
            setProducts(result.data);
        } else {
            toast.error(result.error || "No se pudieron obtener los productos.");
            setProducts([]);
        }
        setIsLoading(false);
    }, [router]);
    
    // El useEffect ahora es mucho más simple y robusto
    useEffect(() => {
        const filtersFromUrl: FilterCriteria = {
            q: searchParams.get('q') || '',
            category: searchParams.get('category') || 'all',
            sortBy: searchParams.get('sortBy') || 'newest',
        };
        runSearch(filtersFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // Dependemos de searchParams para que la búsqueda se ejecute si la URL cambia
    // --- FIN DE LA CORRECCIÓN ---

    return (
        <>
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
                        <ProductList products={products} />
                    ) : (
                        <NoResults />
                    )}
                </div>
            </div>
        </>
    );
}