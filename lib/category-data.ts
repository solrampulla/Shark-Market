// lib/category-data.ts

export interface Subcategory {
  name: string;
  slug: string; // URL-friendly name
  description?: string;
}

export interface Category {
  name: string;
  slug: string; // URL-friendly name
  icon?: string; // Opcional, para el futuro
  subcategories: Subcategory[];
}

export const marketplaceCategories: Category[] = [
  {
    name: "Planes de Negocio",
    slug: "planes-de-negocio",
    icon: "ri-store-2-line",
    subcategories: [
      { name: "Restaurante", slug: "restaurante" },
      { name: "E-commerce", slug: "e-commerce" },
      { name: "SaaS", slug: "saas" },
      { name: "Consultoría", slug: "consultoria" },
      { name: "Tienda Física (Retail)", slug: "tienda-fisica" },
      { name: "Startup Tecnológica", slug: "startup-tecnologica" },
    ],
  },
  {
    name: "Modelos Financieros",
    slug: "modelos-financieros",
    icon: "ri-calculator-line",
    subcategories: [
      { name: "Proyección de Ventas", slug: "proyeccion-ventas" },
      { name: "Análisis de Rentabilidad (ROI)", slug: "analisis-roi" },
      { name: "Flujo de Caja (Cash Flow)", slug: "flujo-de-caja" },
      { name: "Valoración de Empresas", slug: "valoracion-empresas" },
      { name: "Presupuesto Anual", slug: "presupuesto-anual" },
    ],
  },
  {
    name: "Estrategia de Marketing",
    slug: "estrategia-de-marketing",
    icon: "ri-megaphone-line",
    subcategories: [
      { name: "Marketing Digital", slug: "marketing-digital" },
      { name: "Redes Sociales", slug: "redes-sociales" },
      { name: "SEO", slug: "seo" },
      { name: "Email Marketing", slug: "email-marketing" },
      { name: "Plan de Contenidos", slug: "plan-de-contenidos" },
    ],
  },
  {
    name: "Plantillas de Excel",
    slug: "plantillas-de-excel",
    icon: "ri-file-excel-2-line",
    subcategories: [
      { name: "Gestión de Inventario", slug: "gestion-inventario" },
      { name: "Seguimiento de Proyectos", slug: "seguimiento-proyectos" },
      { name: "Facturación", slug: "facturacion" },
      { name: "Nóminas", slug: "nominas" },
    ],
  },
  {
    name: "Documentos Legales",
    slug: "documentos-legales",
    icon: "ri-file-shield-2-line",
    subcategories: [
      { name: "Acuerdo de Confidencialidad (NDA)", slug: "acuerdo-nda" },
      { name: "Términos y Condiciones", slug: "terminos-y-condiciones" },
      { name: "Contrato de Servicios", slug: "contrato-de-servicios" },
      { name: "Política de Privacidad", slug: "politica-privacidad" },
    ],
  },
];