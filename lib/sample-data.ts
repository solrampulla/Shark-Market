// lib/sample-data.ts (o .js) - COMPLETO Y CORREGIDO

// Definición del tipo Product usando snake_case para campos de DB
export interface Product {
  id: string;           // ID único (UUID de Supabase)
  created_at: string;   // Fecha de creación (Supabase la añade)
  title: string;
  description: string | null;
  price: number;
  type: string | null;
  file_path: string | null; // Ruta del archivo en Storage
  user_id: string;       // ID del usuario que lo subió
  image_url?: string | null; // URL de imagen opcional (snake_case)
  type_icon?: string | null; // Icono opcional por tipo (snake_case)
  // Añade aquí cualquier OTRA columna que tengas en tu tabla 'products'
}

// Función para generar slugs (la mantenemos por si se usa en otro sitio)
export const generateSlug = (title: string): string => {
  if (!title) return ''; // Añadimos check por si title es null/undefined
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres no alfanuméricos excepto espacios y guiones
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-'); // Reemplaza múltiples guiones con uno solo
};

// Puedes eliminar cualquier dato de ejemplo que tuvieras aquí si ya no lo necesitas
// const sampleProducts: Product[] = [ ... ];
// export { sampleProducts };