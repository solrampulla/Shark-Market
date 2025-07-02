export type ProductFile = {
  name: string;
  url: string;
  size: number;
  type: string;
};

export type Product = {
  id?: string;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  category: string;
  // type: string; // <-- CAMPO OBSOLETO ELIMINADO
  // industry: string; // <-- CAMPO OBSOLETO ELIMINADO
  language?: string | null;
  previewImageURL?: string | null;
  additionalFiles?: ProductFile[];
  sellerName?: string;
  sellerId?: string;
  sellerUsername?: string | null;
  sellerAvatarUrl?: string | null;
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

export type PurchasedProductEntry = {
    id?: string;
    purchaseOrderId: string;
    title?: string;
    previewImageURL?: string;
    purchaseGrantedAt: number;
    fileURL: string;
};

export interface FilterCriteria {
    category?: string;
    // industry?: string; // <-- CAMPO OBSOLETO ELIMINADO
    // type?: string; // <-- CAMPO OBSOLETO ELIMINADO
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
  professional_title?: string | null;
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