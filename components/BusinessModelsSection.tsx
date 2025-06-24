// --- FILE: components/BusinessModelsSection.tsx ---
// REFACTORED AND TRANSLATED

import BusinessModelCard from './BusinessModelCard';

const BusinessModelsSection = () => {
  // ---> CAMBIO: Contenido traducido y propiedades de color eliminadas.
  const models = [
    { icon: 'ri-repeat-line', title: 'Modelo de Suscripción', description: 'Ingresos recurrentes a través de pagos regulares por el acceso a un producto o servicio.', priceInfo: 'Desde $75', link: '/search?type=Subscription+Model' },
    { icon: 'ri-store-2-line', title: 'Modelo de Franquicia', description: 'Licencia tu formato de negocio a otros para que operen bajo tu marca y sistema.', priceInfo: 'Desde $120', link: '/search?type=Franchise+Model' },
    { icon: 'ri-shopping-basket-2-line', title: 'Modelo de Marketplace', description: 'Conecta a compradores y vendedores, cobrando una comisión por transacción o por listar productos.', priceInfo: 'Desde $85', link: '/search?type=Marketplace+Model' },
    { icon: 'ri-user-star-line', title: 'Modelo Freemium', description: 'Ofrece servicios básicos gratis mientras cobras por características premium o funcionalidad mejorada.', priceInfo: 'Desde $65', link: '/search?type=Freemium+Model' },
    { icon: 'ri-hand-coin-line', title: 'Modelo de Venta Directa', description: 'Vende productos directamente a los consumidores a través de una red de representantes independientes.', priceInfo: 'Desde $70', link: '/search?type=Direct+Sales+Model' },
    { icon: 'ri-restaurant-line', title: 'Modelo de Restaurante', description: 'Modelo de negocio completo para restaurantes, cafés y servicios de comida con guías operativas.', priceInfo: 'Desde $95', link: '/search?type=Restaurant+Model' },
  ];

  return (
    // ---> CAMBIO: Usamos nuestro color de fondo temático.
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          {/* ---> CAMBIO: Título con nuevo estilo y traducción. */}
          <h2 className="font-serif text-4xl font-bold text-text-DEFAULT mb-4">
            Modelos de Negocio Populares
          </h2>
          {/* ---> CAMBIO: Subtítulo con nuevo estilo y traducción. */}
          <p className="text-lg text-text-light max-w-3xl mx-auto">
            Explora nuestra colección de modelos de negocio probados que han ayudado a emprendedores a triunfar en diversas industrias.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <div key={index} className="flex">
              <BusinessModelCard {...model} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessModelsSection;