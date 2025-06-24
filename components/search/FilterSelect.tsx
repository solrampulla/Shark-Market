// Contenido para el NUEVO archivo: components/search/FilterSelect.tsx

'use client';

import React from 'react';

// Definimos las "instrucciones" (props) que necesita este componente
interface FilterSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string; }[]; // Siempre espera este formato de opciones
  defaultOptionLabel: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  defaultOptionLabel 
}) => (
  <div className="relative">
    <label htmlFor={`filter-${name}`} className="sr-only">{label}</label>
    <select
      id={`filter-${name}`}
      name={name}
      title={label}
      value={value}
      onChange={onChange}
      className="text-sm bg-slate-100 border border-slate-200 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 hover:border-slate-300 cursor-pointer appearance-none w-full"
    >
      <option value="">{defaultOptionLabel}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);

export default FilterSelect;