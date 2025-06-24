// File: components/filters/ProductFilters.tsx
"use client";

import React, { useState, useEffect } from 'react';

// Tipos para las props del componente
interface ProductFiltersProps {
  industries: string[];
  languages: string[];
  productTypes: string[]; 
  
  initialFilters?: {
    searchTerm?: string;
    industry?: string;
    language?: string;
    type?: string;
  };

  onFilterSubmit: (filters: {
    searchTerm: string;
    industry: string;
    language: string;
    type: string;
  }) => void;

  isLoading?: boolean;
}

export default function ProductFilters({
  industries,
  languages,
  productTypes,
  initialFilters,
  onFilterSubmit,
  isLoading = false,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [selectedIndustry, setSelectedIndustry] = useState(initialFilters?.industry || '');
  const [selectedLanguage, setSelectedLanguage] = useState(initialFilters?.language || '');
  const [selectedType, setSelectedType] = useState(initialFilters?.type || '');

  useEffect(() => {
    setSearchTerm(initialFilters?.searchTerm || '');
    setSelectedIndustry(initialFilters?.industry || '');
    setSelectedLanguage(initialFilters?.language || '');
    setSelectedType(initialFilters?.type || '');
  }, [initialFilters]);

  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('[ProductFilters] Aplicando filtros:', { searchTerm, selectedIndustry, selectedLanguage, selectedType });
    onFilterSubmit({
      searchTerm: searchTerm.trim(),
      industry: selectedIndustry,
      language: selectedLanguage,
      type: selectedType,
    });
  };

  const handleClearFilters = () => {
    console.log('[ProductFilters] Limpiando filtros.');
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedLanguage('');
    setSelectedType('');
    onFilterSubmit({
      searchTerm: '',
      industry: '',
      language: '',
      type: '',
    });
  };

  return (
    <form
      onSubmit={handleApplyFilters}
      className="p-4 md:p-6 mb-8 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Búsqueda por Texto */}
        <div className="lg:col-span-2">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar por palabra clave
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: plan de marketing, modelo SaaS..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        {/* Filtro por Industria */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Industria
          </label>
          <select
            id="industry"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Todas</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Idioma */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Idioma
          </label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Todos</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo de Producto */}
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Producto
          </label>
          <select
            id="productType"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">Todos</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Botones de Acción */}
        <div className="lg:col-start-3 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition duration-150 ease-in-out"
          >
            {isLoading ? 'Buscando...' : 'Aplicar Filtros'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row">
            <button
                type="button"
                onClick={handleClearFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 transition duration-150 ease-in-out"
            >
                Limpiar Filtros
            </button>
        </div>

      </div>
    </form>
  );
}
