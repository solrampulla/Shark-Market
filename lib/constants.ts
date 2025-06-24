// ========================================================================
// ARCHIVO COMPLETO Y CORREGIDO: lib/constants.ts
// ========================================================================

// --- Listas para Formularios y Filtros ---

export const CATEGORIES = [
  { value: 'business-plan', label: 'Planes de Negocio' },
  { value: 'financial-model', label: 'Modelos Financieros' },
  { value: 'marketing-strategy', label: 'Estrategia de Marketing' },
  { value: 'market-analysis', label: 'Análisis de Mercado' },
  { value: 'other', label: 'Otro' },
];

export const INDUSTRIES = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'food-and-beverage', label: 'Alimentación y Bebidas' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'retail', label: 'Retail' },
  { value: 'services', label: 'Servicios' },
  { value: 'education', label: 'Educación' },
  { value: 'health', label: 'Salud' },
  { value: 'other', label: 'Otro' },
];

// NOTA: He ajustado esta lista para que refleje el TIPO de producto digital.
export const PRODUCT_TYPES = [
  { value: 'template', label: 'Plantilla' },
  { value: 'guide', label: 'Guía' },
  { value: 'toolkit', label: 'Toolkit' },
  { value: 'course', label: 'Curso' },
  { value: 'report', label: 'Informe' },
];

// Usamos códigos de idioma estándar (ISO 639-1) para el 'value'.
export const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'pt', label: 'Portugués' },
  { value: 'fr', label: 'Francés' },
  { value: 'other', label: 'Otro' },
];


// --- Opciones de Ordenamiento para Páginas de Búsqueda ---

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Más Nuevos' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
];
