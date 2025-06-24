// --- NUEVO ARCHIVO: components/upload/wizard-steps/Step4_FinancialsForm.tsx ---
'use client';

import React from 'react';

// Definimos la forma de los datos que este paso maneja
interface FinancialsData {
  initial_investment: number | string;
  monthly_revenue: number | string;
  fixed_costs_monthly: number | string;
  variable_cost_per_unit: number | string;
  growth_rate: number | string;
}

interface Step4Props {
  data: FinancialsData;
  onDataChange: (field: keyof FinancialsData, value: string) => void;
}

export default function Step4_FinancialsForm({ data, onDataChange }: Step4Props) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange(e.target.name as keyof FinancialsData, e.target.value);
  };

  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputStyle = "block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";
  const subTextStyle = "mt-1 text-xs text-slate-500";
  const inputWrapperStyle = "relative";
  const currencySymbolStyle = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400";
  const percentSymbolStyle = "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400";


  return (
    <div className="space-y-6">
       <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Proyecciones Clave</h3>
          <p className={subTextStyle + " max-w-xl mx-auto"}>Introduce estimaciones realistas. Estos datos se usarán para calcular automáticamente el potencial de tu negocio para los compradores.</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div>
                <label htmlFor="initial_investment" className={labelStyle}>Inversión Inicial (€) *</label>
                <div className={inputWrapperStyle}>
                    <div className={currencySymbolStyle}>€</div>
                    <input type="number" name="initial_investment" id="initial_investment" value={data.initial_investment} onChange={handleChange} className={inputStyle + " pl-7"} placeholder="5000" required min="0" />
                </div>
                <p className={subTextStyle}>Coste total para poner en marcha el negocio.</p>
            </div>
            <div>
                <label htmlFor="monthly_revenue" className={labelStyle}>Ingreso Mensual Estimado (€) *</label>
                 <div className={inputWrapperStyle}>
                    <div className={currencySymbolStyle}>€</div>
                    <input type="number" name="monthly_revenue" id="monthly_revenue" value={data.monthly_revenue} onChange={handleChange} className={inputStyle + " pl-7"} placeholder="1500" required min="0" />
                </div>
                <p className={subTextStyle}>Tu estimación de ventas en un mes promedio.</p>
            </div>
            <div>
                <label htmlFor="fixed_costs_monthly" className={labelStyle}>Costes Fijos Mensuales (€) *</label>
                 <div className={inputWrapperStyle}>
                    <div className={currencySymbolStyle}>€</div>
                    <input type="number" name="fixed_costs_monthly" id="fixed_costs_monthly" value={data.fixed_costs_monthly} onChange={handleChange} className={inputStyle + " pl-7"} placeholder="400" required min="0" />
                </div>
                <p className={subTextStyle}>Alquiler, sueldos, software, etc.</p>
            </div>
            <div>
                <label htmlFor="variable_cost_per_unit" className={labelStyle}>Coste Variable por Venta (%) *</label>
                 <div className={inputWrapperStyle}>
                    <input type="number" name="variable_cost_per_unit" id="variable_cost_per_unit" value={data.variable_cost_per_unit} onChange={handleChange} className={inputStyle + " pr-7"} placeholder="30" required min="0" max="100"/>
                    <div className={percentSymbolStyle}>%</div>
                </div>
                <p className={subTextStyle}>Comisiones de pago, materia prima, etc.</p>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="growth_rate" className={labelStyle}>Tasa de Crecimiento Mensual Estimada (%) *</label>
                 <div className={inputWrapperStyle}>
                    <input type="number" name="growth_rate" id="growth_rate" value={data.growth_rate} onChange={handleChange} className={inputStyle + " pr-7"} placeholder="5" required min="0" />
                    <div className={percentSymbolStyle}>%</div>
                </div>
                <p className={subTextStyle}>¿Cuánto esperas que crezcan tus ingresos cada mes?</p>
            </div>
       </div>
    </div>
  );
}