// --- FILE: components/HowItWorksSection.tsx ---
// CORRECTED VERSION

import Link from 'next/link';

const HowItWorksSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Step 1 */}
          <div>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i className="ri-file-list-3-line text-3xl"></i> {/* Ajusta tamaño icono */}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create</h3>
            <p className="text-gray-600">Package your business expertise into templates</p>
          </div>
          {/* Step 2 */}
          <div>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i className="ri-price-tag-3-line text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Price</h3>
            <p className="text-gray-600">Set your own price based on value</p>
          </div>
          {/* Step 3 */}
          <div>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i className="ri-money-dollar-circle-line text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn</h3>
            <p className="text-gray-600">Get paid for your business expertise</p>
          </div>
        </div>
        <div className="mt-12 text-center">
           {/* Link Corregido: sin legacyBehavior, sin <a>, className en Link */}
           <Link href="/sell" className="px-6 py-3 bg-primary text-white font-medium rounded-button whitespace-nowrap hover:bg-primary/90 transition inline-block">
             {'Start Selling'}
           </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;