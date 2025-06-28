// ========================================================================
// ARCHIVO COMPLETO Y CORREGIDO
// ========================================================================

// --- Textos de Marketing y Contenido del Sitio ---

// CORRECCIÓN: Se reestructura el objeto SITE_HERO para incluir un pre-título
export const SITE_HERO = {
  pretitle: "TU MARKETPLACE DE KNOW-HOW EMPRESARIAL",
  title: "La Ventaja que se Compra.",
  subtitle: "Accede a sistemas de negocio y estrategias validadas por líderes de la industria. El atajo definitivo para escalar tus resultados."
};


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

export const PRODUCT_TYPES = [
  { value: 'template', label: 'Plantilla' },
  { value: 'guide', label: 'Guía' },
  { value: 'toolkit', label: 'Toolkit' },
  { value: 'course', label: 'Curso' },
  { value: 'report', label: 'Informe' },
];

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