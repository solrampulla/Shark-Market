// --- NUEVO ARCHIVO: components/upload/wizard-steps/Step3_MarketingForm.tsx ---
'use client';

import React from 'react';

// Lista de canales de marketing
const MARKETING_CHANNELS = [
  { id: 'seo', label: 'SEO (Blog, Contenido)' },
  { id: 'social_media', label: 'Redes Sociales (Orgánico)' },
  { id: 'paid_ads', label: 'Publicidad Pagada (Google, Facebook, etc.)' },
  { id: 'email_marketing', label: 'Email Marketing' },
  { id: 'alliances', label: 'Alianzas Estratégicas' },
  { id: 'word_of_mouth', label: 'Boca a Boca / Referidos' },
];

interface MarketingData {
  marketing_channels: string[];
  successful_strategy_description: string;
  sales_process: string;
  upsell_product_id: string;
}

interface Step3Props {
  data: MarketingData;
  onDataChange: (field: keyof MarketingData, value: string | string[]) => void;
}

export default function Step3_MarketingForm({ data, onDataChange }: Step3Props) {
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentChannels = data.marketing_channels || [];
    
    let updatedChannels;
    if (checked) {
      updatedChannels = [...currentChannels, value];
    } else {
      updatedChannels = currentChannels.filter(channel => channel !== value);
    }
    onDataChange('marketing_channels', updatedChannels);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDataChange(name as keyof MarketingData, value);
  };

  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputStyle = "block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";
  const subTextStyle = "mt-1 text-xs text-slate-500";

  return (
    <div className="space-y-6">
      <div>
        <label className={labelStyle}>Canales de Marketing Utilizados *</label>
        <p className={subTextStyle + " mb-3"}>Selecciona todos los que apliquen. Al menos uno es requerido.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MARKETING_CHANNELS.map(channel => (
            <label key={channel.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="marketing_channels"
                value={channel.id}
                checked={data.marketing_channels?.includes(channel.id)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-accent focus:ring-accent border-slate-300 rounded"
              />
              <span className="text-sm font-medium text-slate-700">{channel.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="successful_strategy_description" className={labelStyle}>Describe tu Estrategia más Exitosa *</label>
        <textarea name="successful_strategy_description" id="successful_strategy_description" value={data.successful_strategy_description} onChange={handleChange} rows={4} className={inputStyle} placeholder="Ej: Creamos una serie de 10 artículos en el blog sobre finanzas para no-financieros, lo que nos posicionó como expertos y atrajo tráfico cualificado." required />
      </div>
      <div>
        <label htmlFor="sales_process" className={labelStyle}>Proceso de Venta *</label>
        <textarea name="sales_process" id="sales_process" value={data.sales_process} onChange={handleChange} rows={4} className={inputStyle} placeholder="Describe los pasos desde que un cliente te descubre hasta que realiza la compra." required />
      </div>
       <div>
        <label htmlFor="upsell_product_id" className={labelStyle}>Vincular Producto de Estrategia (Opcional)</label>
        <input type="text" name="upsell_product_id" id="upsell_product_id" value={data.upsell_product_id} onChange={handleChange} className={inputStyle} placeholder="Pega aquí el ID de otro producto de Founder Market" />
        <p className={subTextStyle}>Si tienes una plantilla que detalla tu estrategia de marketing, ¡vincúlala aquí para hacer una venta cruzada!</p>
      </div>
    </div>
  );
}