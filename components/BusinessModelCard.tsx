// --- FILE: components/BusinessModelCard.tsx ---
// REFACTORED AND TRANSLATED

import Link from 'next/link';

// ---> CAMBIO: Props de color eliminadas de la interfaz.
interface BusinessModelCardProps {
  icon: string;
  title: string;
  description: string;
  priceInfo: string;
  link: string;
}

const BusinessModelCard: React.FC<BusinessModelCardProps> = ({
  icon, title, description, priceInfo, link
}) => {
  return (
    // ---> CAMBIO: Nuevo estilo de tarjeta para consistencia, con mejor hover.
    <div className="bg-background-card rounded-lg border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full w-full">
      <div className="flex items-center mb-4">
        {/* ---> CAMBIO: Estilo de icono unificado con nuestro color 'accent'. */}
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-accent/10 text-accent mr-4 flex-shrink-0">
          <i className={`${icon} text-2xl`}></i>
        </div>
        <h3 className="text-lg font-bold text-text-DEFAULT">{title}</h3>
      </div>
      <p className="text-text-light mb-4 text-sm flex-grow">{description}</p>
      
      {/* ---> CAMBIO: Pie de tarjeta con 'mt-auto' para alinearse abajo. */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
        <span className="text-sm text-text-light">{priceInfo}</span>
        {/* ---> CAMBIO: Enlace rediseñado como una llamada a la acción clara. */}
        <Link href={link} className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-x-1">
          Ver Plantillas
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>
    </div>
  );
};

export default BusinessModelCard;
