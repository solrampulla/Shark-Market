// --- ARCHIVO CORREGIDO: components/upload/ProductCreationWizard.tsx ---
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
// ---> CORRECCIÓN: La importación ahora apunta al nuevo archivo de acciones de producto.
import { createAssistedProductAction } from '@/app/actions/product.actions'; 
import Step1_BasicInfoForm from './wizard-steps/Step1_BasicInfoForm';
import Step2_MarketAnalysisForm from './wizard-steps/Step2_MarketAnalysisForm';
import Step3_MarketingForm from './wizard-steps/Step3_MarketingForm';
import Step4_FinancialsForm from './wizard-steps/Step4_FinancialsForm';
import Step5_FinalizeForm from './wizard-steps/Step5_FinalizeForm';

// Definición de la data del producto (estructura plana para el formulario)
interface ProductFormData {
  title: string; description: string; price: number | string; category: string; industry: string; type: string;
  location_country: string; market_size: number | string; customer_profile_summary: string;
  strengths: string; weaknesses: string; opportunities: string; threats: string;
  marketing_channels: string[]; successful_strategy_description: string; sales_process: string; upsell_product_id: string;
  initial_investment: number | string; monthly_revenue: number | string; fixed_costs_monthly: number | string;
  variable_cost_per_unit: number | string; growth_rate: number | string;
}

export default function ProductCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  // ---> CORRECCIÓN: Estado inicial completo para evitar errores de tipo.
  const [productData, setProductData] = useState<ProductFormData>({
    title: '', description: '', price: '', category: '', industry: '', type: '',
    location_country: '', market_size: '', customer_profile_summary: '',
    strengths: '', weaknesses: '', opportunities: '', threats: '',
    marketing_channels: [], successful_strategy_description: '', sales_process: '', upsell_product_id: '',
    initial_investment: '', monthly_revenue: '', fixed_costs_monthly: '', variable_cost_per_unit: '', growth_rate: ''
  });
  
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentStep === 5 && executiveSummary === '') {
      const summary = `Este producto detalla un plan de negocio para un ${productData.type.toLowerCase()} en la industria de ${productData.industry}, localizado en ${productData.location_country}. El proyecto está dirigido a ${productData.customer_profile_summary.toLowerCase()}. La estrategia de marketing se centra en ${productData.marketing_channels.join(', ')}. Con una inversión inicial de ${productData.initial_investment}€ y unos ingresos mensuales estimados de ${productData.monthly_revenue}€, este plan ofrece una visión completa para alcanzar el éxito.`;
      setExecutiveSummary(summary);
    }
  }, [currentStep, productData, executiveSummary]);

  const handleDataChange = (field: keyof ProductFormData, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAdditionalFilesChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const currentFileNames = new Set(additionalFiles.map(f => f.name));
      const filteredNewFiles = Array.from(newFiles).filter(f => !currentFileNames.has(f.name));
      setAdditionalFiles(prev => [...prev, ...filteredNewFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAdditionalFiles(prev => prev.filter(f => f.name !== fileName));
  };
  
  const handleNext = () => { if (currentStep < totalSteps) setCurrentStep(prev => prev + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };
  
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  const isStep1Complete = productData.title.trim() !== '' && Number(productData.price) > 0 && previewImageFile !== null;
  const isStep2Complete = productData.location_country.trim() !== '' && Number(productData.market_size) > 0;
  const isStep3Complete = productData.marketing_channels.length > 0;
  const isStep4Complete = Number(productData.initial_investment) >= 0 && Number(productData.monthly_revenue) > 0;
  const isStep5Complete = additionalFiles.length > 0 && executiveSummary.trim().length > 50;

  const isNextDisabled = () => {
    switch (currentStep) {
        case 1: return !isStep1Complete;
        case 2: return !isStep2Complete;
        case 3: return !isStep3Complete;
        case 4: return !isStep4Complete;
        default: return false;
    }
  }
  
  const handleFinalSubmit = async () => {
      if (!user) { // ---> CORRECCIÓN: Verificación de 'user' antes de usar 'user.uid'
          toast.error("Debes iniciar sesión para publicar un producto.");
          return;
      }
      if (!isStep5Complete) {
          toast.warning("Por favor, sube al menos un archivo y completa el resumen ejecutivo.");
          return;
      }
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('userId', user.uid);
      if (previewImageFile) formData.append('previewImage', previewImageFile);
      additionalFiles.forEach(file => formData.append('additionalFiles', file));
      formData.append('executiveSummary', executiveSummary);
      
      const marketAnalysis = {
        location_country: productData.location_country, market_size: Number(productData.market_size),
        customer_profile_summary: productData.customer_profile_summary, strengths: productData.strengths,
        weaknesses: productData.weaknesses, opportunities: productData.opportunities, threats: productData.threats,
      };
      formData.append('marketAnalysis', JSON.stringify(marketAnalysis));

      const financials = {
        initial_investment: Number(productData.initial_investment), monthly_revenue: Number(productData.monthly_revenue),
        fixed_costs_monthly: Number(productData.fixed_costs_monthly), variable_cost_per_unit: Number(productData.variable_cost_per_unit),
        growth_rate: Number(productData.growth_rate),
      };
      formData.append('financials', JSON.stringify(financials));

      const basicData = { title: productData.title, description: productData.description, price: productData.price, category: productData.category, industry: productData.industry, type: productData.type };
      Object.entries(basicData).forEach(([key, value]) => formData.append(key, String(value)));

      const result = await createAssistedProductAction(formData);

      if (result.success && result.productId) {
          toast.success(result.message);
          router.push(`/product/${result.productId}`);
      } else {
          toast.error(result.message || 'Hubo un error al publicar el producto.');
      }
      setIsSubmitting(false);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
      <div className="mb-8">
          <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-accent">Paso {currentStep} de {totalSteps}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div className="bg-accent h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
      </div>
      <div className="min-h-[300px]">
        {currentStep === 1 && <Step1_BasicInfoForm data={productData} onDataChange={handleDataChange} previewImage={previewImageFile} onPreviewImageChange={setPreviewImageFile} />}
        {currentStep === 2 && <Step2_MarketAnalysisForm data={productData} onDataChange={handleDataChange} />}
        {currentStep === 3 && <Step3_MarketingForm data={productData} onDataChange={handleDataChange} />}
        {currentStep === 4 && <Step4_FinancialsForm data={productData} onDataChange={handleDataChange} />}
        {currentStep === 5 && <Step5_FinalizeForm executiveSummary={executiveSummary} onSummaryChange={setExecutiveSummary} files={additionalFiles} onFilesChange={handleAdditionalFilesChange} onFileRemove={handleRemoveFile} />}
      </div>
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
        <button onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
          Anterior
        </button>
        {currentStep < totalSteps ? (
          <button onClick={handleNext} disabled={isNextDisabled()} className="px-6 py-2 text-sm font-semibold text-white bg-accent hover:bg-accent-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente
          </button>
        ) : (
          <button onClick={handleFinalSubmit} disabled={!isStep5Complete || isSubmitting} className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Publicando...' : 'Finalizar y Publicar'}
          </button>
        )}
      </div>
    </div>
  );
}