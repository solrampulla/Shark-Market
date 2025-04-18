// --- FILE: components/BusinessModelsSection.tsx ---

import BusinessModelCard from './BusinessModelCard';

const BusinessModelsSection = () => {
  const models = [
    { icon: 'ri-repeat-line', title: 'Subscription Model', description: 'Recurring revenue through regular payments for ongoing access to a product or service.', priceInfo: 'Starting at $75', link: '/templates/subscription', iconBgColor: 'bg-blue-100', iconTextColor: 'text-primary' },
    { icon: 'ri-store-2-line', title: 'Franchise Model', description: 'License your business format to others who operate under your brand and system.', priceInfo: 'Starting at $120', link: '/templates/franchise', iconBgColor: 'bg-green-100', iconTextColor: 'text-green-600' },
    { icon: 'ri-shopping-basket-2-line', title: 'Marketplace Model', description: 'Connect buyers and sellers, taking a commission on transactions or charging listing fees.', priceInfo: 'Starting at $85', link: '/templates/marketplace', iconBgColor: 'bg-red-100', iconTextColor: 'text-red-600' },
    { icon: 'ri-user-star-line', title: 'Freemium Model', description: 'Offer basic services for free while charging for premium features or enhanced functionality.', priceInfo: 'Starting at $65', link: '/templates/freemium', iconBgColor: 'bg-yellow-100', iconTextColor: 'text-yellow-600' },
    { icon: 'ri-hand-coin-line', title: 'Direct Sales Model', description: 'Sell products directly to consumers through a network of independent representatives.', priceInfo: 'Starting at $70', link: '/templates/direct-sales', iconBgColor: 'bg-indigo-100', iconTextColor: 'text-indigo-600' },
    { icon: 'ri-restaurant-line', title: 'Restaurant Model', description: 'Complete business model for restaurants, cafes, and food service businesses with operational guidelines.', priceInfo: 'Starting at $95', link: '/templates/restaurant', iconBgColor: 'bg-orange-100', iconTextColor: 'text-orange-600' },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Business Models</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of proven business models that have helped entrepreneurs succeed across various industries
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
             // Ensure each card in the grid stretches if needed (useful for consistent height)
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