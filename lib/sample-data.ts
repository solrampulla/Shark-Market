// lib/sample-data.ts (CORRECTED - Added 'description' to interface)

// 1. Actualizamos la interfaz para incluir 'description' (opcional)
export interface Product {
  imageUrl: string;
  title: string;
  price: number;
  type: string;
  typeIcon: string;
  description?: string; // <-- ¡PROPIEDAD AÑADIDA AQUÍ! (El '?' la hace opcional)
  buyLink?: string;
  slug?: string;
}

// Mantenemos y exportamos la función para generar slugs
export function generateSlug(title: string): string {
   return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Quita caracteres raros
    .replace(/\s+/g, '-')         // Reemplaza espacios con guiones
    .replace(/-+/g, '-');        // Evita guiones múltiples
}

// Ya NO tenemos la lista de productos aquí, se lee desde Supabase.