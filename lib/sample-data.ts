// lib/sample-data.ts (Verificar esta interfaz)

export interface Product {
  id: string | number;
  created_at: string;
  title: string;
  price: number;
  type: string;
  typeIcon: string;
  image_url?: string | null;
  description?: string | null;
  industry?: string | null;
  target_audience?: string | null;
  language?: string | null;
  est_initial_investment?: string | null;
  est_profit_margin?: string | null;
  est_payback_period?: string | null;
  related_software?: string | null; // <-- Asegurar que esté
  tags?: string | null;             // <-- Asegurar que esté
  file_path?: string | null;
  user_id?: string | null;
  buyLink?: string;
  slug?: string;
}
