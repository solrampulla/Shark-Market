// --- NUEVO ARCHIVO: components/upload/wizard-steps/Step2_MarketAnalysisForm.tsx ---
'use client';

import React from 'react';

// Definimos la forma de los datos que este paso maneja
interface MarketAnalysisData {
  location_country: string;
  market_size: number | string;
  customer_profile_summary: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

interface Step2Props {
  data: MarketAnalysisData;
  onDataChange: (field: keyof MarketAnalysisData, value: string | number) => void;
}

export default function Step2_MarketAnalysisForm({ data, onDataChange }: Step2Props) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onDataChange(name as keyof MarketAnalysisData, type === 'number' ? parseFloat(value) || '' : value);
  };
  
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputStyle = "block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";
  const subTextStyle = "mt-1 text-xs text-slate-500";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location_country" className={labelStyle}>País de Implementación *</label>
          <input type="text" name="location_country" id="location_country" value={data.location_country} onChange={handleChange} className={inputStyle} placeholder="Ej: España" required />
          <p className={subTextStyle}>El principal mercado geográfico de tu negocio.</p>
        </div>
        <div>
          <label htmlFor="market_size" className={labelStyle}>Tamaño del Mercado Estimado (€) *</label>
          <input type="number" name="market_size" id="market_size" value={data.market_size} onChange={handleChange} className={inputStyle} placeholder="5000000" required />
          <p className={subTextStyle}>Valor total anual del mercado al que apuntas.</p>
        </div>
      </div>
      <div>
        <label htmlFor="customer_profile_summary" className={labelStyle}>Describe a tu Cliente Ideal *</label>
        <textarea name="customer_profile_summary" id="customer_profile_summary" value={data.customer_profile_summary} onChange={handleChange} rows={4} className={inputStyle} placeholder="Ej: Emprendedores primerizos de entre 25-40 años en el sector tecnológico que buscan su primera ronda de financiación." required />
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Análisis Estratégico (DAFO/SWOT)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="strengths" className={labelStyle}>Fortalezas</label>
                <textarea name="strengths" id="strengths" value={data.strengths} onChange={handleChange} rows={3} className={inputStyle} placeholder="¿En qué eres mejor que la competencia?" />
            </div>
            <div>
                <label htmlFor="weaknesses" className={labelStyle}>Debilidades</label>
                <textarea name="weaknesses" id="weaknesses" value={data.weaknesses} onChange={handleChange} rows={3} className={inputStyle} placeholder="¿Qué limitaciones internas tienes?" />
            </div>
            <div>
                <label htmlFor="opportunities" className={labelStyle}>Oportunidades</label>
                <textarea name="opportunities" id="opportunities" value={data.opportunities} onChange={handleChange} rows={3} className={inputStyle} placeholder="¿Qué tendencias del mercado puedes aprovechar?" />
            </div>
            <div>
                <label htmlFor="threats" className={labelStyle}>Amenazas</label>
                <textarea name="threats" id="threats" value={data.threats} onChange={handleChange} rows={3} className={inputStyle} placeholder="¿Qué factores externos pueden perjudicarte?" />
            </div>
        </div>
      </div>
    </div>
  );
}