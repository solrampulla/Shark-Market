// --- FILE: components/Header.tsx ---

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  // Calcula la altura real del header para usarla en el padding del main content
  // Esta altura puede variar ligeramente por padding/border. Inspecciona el elemento.
  // Asumamos que py-3 (12px arriba, 12px abajo) + altura de línea del texto/icono más alto. Aprox 48px + 24px = ~60-64px
  // El padding top en <main> en layout.tsx debe coincidir con esta altura.
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-[60px]"> {/* Define una altura fija si es posible */}
      <div className="container mx-auto px-4 h-full flex items-center justify-between"> {/* h-full para que el contenido use la altura */}
        <div className="flex items-center">
          {/* Usa la clase font-pacifico definida en tailwind.config */}
          <Link href="/" className="text-2xl font-pacifico text-primary">
            BizPlan
          </Link>
        </div>
        {/* Search Bar */}
        <div className="relative max-w-md w-full mx-4 hidden md:block"> {/* Ocultar en móvil como ejemplo */}
          <div className="absolute inset-y-0 left-0 w-10 h-10 flex items-center justify-center text-gray-500 pointer-events-none">
            <i className="ri-search-line text-lg"></i>
          </div>
          <input
            type="text"
            placeholder="Search for knowledge..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition">
            <span className="flex items-center">
              <i className="ri-add-line mr-1"></i> Sell Business Plan
            </span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden">
            {/* Usar next/image */}
            <Image
              src="https://public.readdy.ai/ai/img_res/d56422880e92f92c67bc84320d50aaf3.jpg"
              alt="Profile"
              width={40} // Necesario para next/image
              height={40} // Necesario para next/image
              className="w-full h-full object-cover"
            />
          </div>
           {/* Podrías añadir aquí un botón para mostrar/ocultar búsqueda en móvil */}
        </div>
      </div>
    </header>
  );
};

export default Header;