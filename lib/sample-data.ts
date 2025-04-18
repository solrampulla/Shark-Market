// lib/sample-data.ts (VERSIÓN LIMPIA)

// Mantenemos la interfaz 'Product' para que otros archivos sepan cómo son los datos de un producto.
// La exportamos para que puedan importarla.
export interface Product {
  imageUrl: string;
  title: string;
  price: number;
  type: string;
  typeIcon: string;
  buyLink?: string; // Mantenemos las props opcionales por si acaso
  slug?: string;    // Mantenemos las props opcionales por si acaso
}

// Mantenemos y exportamos la función para generar slugs, porque la seguimos usando
// en FeaturedSection.tsx y potencialmente en page.tsx para encontrar el producto.
export function generateSlug(title: string): string {
   return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Quita caracteres raros
    .replace(/\s+/g, '-')         // Reemplaza espacios con guiones
    .replace(/-+/g, '-');        // Evita guiones múltiples
}

// --- LA DEFINICIÓN DEL ARRAY 'export const featuredProducts = [...]' SE HA BORRADO ---
// --- EL BUCLE 'featuredProducts.forEach(...)' TAMBIÉN SE HA BORRADO       ---
// --- Esos datos ahora viven únicamente en 'public/products.json'          ---