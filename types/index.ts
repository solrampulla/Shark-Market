// --- ARCHIVO COMPLETO Y CORREGIDO: types/index.ts ---

export type ProductFile = {
  name: string;
  url: string;
  size: number;
  type: string;
};

// --- TIPO 'PRODUCT' REESTRUCTURADO Y MEJORADO ---
export type Product = {
  id?: string;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  category: string;
  type: string;
  industry: string;
  language?: string | null;
  
  // --- ESTRATEGIA DE DOBLE IMAGEN ---
  coverImageUrl?: string | null;     // La imagen de portada curada que mostramos en la tarjeta.
  sellerImageUrl?: string | null;  // La imagen personalizada que el vendedor sube.

  // --- INFORMACIÓN DEL VENDEDOR AGRUPADA ---
  seller: {
    id: string;
    name: string;
    imageUrl: string;
    credential?: string;
  } | null;

  additionalFiles?: ProductFile[]; 
  createdAt?: number | null; 
  tags?: string[];
  isWishlisted?: boolean;
  approved?: boolean;
  searchableKeywords?: string[];
  updatedAt?: number | null;
  averageRating?: number;
  reviewCount?: number;
  executiveSummary?: string;
  marketAnalysis?: {
      location_country: string;
      market_size: number;
      customer_profile_summary: string;
      strengths: string; weaknesses: string; opportunities: string; threats: string;
  };
  financials?: {
      initial_investment: number; monthly_revenue: number; fixed_costs_monthly: number;
      variable_cost_per_unit: number; growth_rate: number;
  };
};
// --- FIN DE LA REESTRUCTURACIÓN ---

export type PurchasedProductEntry = {
    id?: string;
    purchaseOrderId: string;
    title?: string;
    previewImageURL?: string; // Considera renombrar a coverImageUrl aquí también por consistencia
    purchaseGrantedAt: number;
    fileURL: string;
};

export interface FilterCriteria {
    category?: string;
    industry?: string;
    type?: string;
    sortBy?: string;
    q?: string;
}

export interface ProfileData {
  id?: string;
  email?: string | null;
  role?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  username?: string | null;
  professional_title?: string | null; // Este campo puede ser la 'credential' del vendedor
  website_url?: string | null;
  linkedin_url?: string | null;
  stripeAccountId?: string | null;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: number;
    buyerName: string;
    buyerAvatarUrl?: string | null;
}