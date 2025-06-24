// lib/utils.ts
export const getIconForType = (category: string): string => {
    switch (category) { // Usaremos category aquí
      case "Planes de Negocio": return "ri-file-list-3-line";
      case "Modelos Financieros": return "ri-calculator-line"; // Icono diferente
      case "Estrategia de Marketing": return "ri-megaphone-line";
      case "Análisis de Mercado": return "ri-bar-chart-grouped-line"; // Icono diferente
      default: return "ri-file-text-line"; // Icono genérico
    }
};

export function generateSlug(title: string): string {
   return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}