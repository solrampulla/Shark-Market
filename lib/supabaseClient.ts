// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Obtén la URL y la clave Anon de las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Valida que las variables de entorno estén presentes
// Esto es útil durante el desarrollo para asegurarte de que .env.local está bien configurado
if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Crea y exporta el cliente Supabase
// Usamos createClient de la librería @supabase/supabase-js
// Le pasamos la URL y la clave ANÓNIMA (pública)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Nota: Este cliente usa la clave anónima, ideal para operaciones
// desde el navegador donde la seguridad se basa en RLS (Row Level Security).
// Para operaciones que requieran permisos elevados desde el servidor,
// se usarían otras configuraciones o la clave service_role, pero más adelante.