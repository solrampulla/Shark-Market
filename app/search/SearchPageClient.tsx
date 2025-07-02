'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { type Product } from '@/types';
import FilterBar from '@/components/FilterBar';
import ProductList from '@/components/products/ProductList'; 

const NoResults = () => (
    <div className="text-center h-64 flex flex-col justify-center items-center bg-white rounded-lg border shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700">No se encontraron resultados</h3>
        <p className="text-slate-500 mt-2">Prueba a cambiar o eliminar algunos filtros para encontrar lo que buscas.</p>
    </div>
);

export default function SearchPageClient({ initialProducts }: { initialProducts: Product[] }) {
    const searchParams = useSearchParams();
    
    const initialFilters = {
        q: searchParams.get('q') || '',
        category: searchParams.get('category') || 'all',
        sortBy: searchParams.get('sortBy') || 'newest',
    };

    return (
        <>
            <FilterBar initialFilters={initialFilters} onFiltersUpdate={() => {}} />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="font-serif text-4xl font-bold text-slate-800">
                        {initialFilters.q ? `Resultados para "${initialFilters.q}"` : "Explorar Productos"}
                    </h1>
                    <p className="mt-2 text-lg text-slate-500">Encuentra las herramientas que necesitas para crecer.</p>
                </div>
                
                <div className="mt-8">
                    {initialProducts.length > 0 ? (
                        <ProductList products={initialProducts} />
                    ) : (
                        <NoResults />
                    )}
                </div>
            </div>
        </>
    );
}