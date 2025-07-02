// components/TrustedBySection.tsx

import Image from 'next/image';

// Define aquí los logos que quieres mostrar.
// Asegúrate de que el 'path' coincida con el nombre del archivo que guardes en 'public/logos'.
const companies = [
  { name: 'Google', path: '/logos/google.png' },
  { name: 'Amazon', path: '/logos/amazon.png' },
  { name: 'McKinsey & Company', path: '/logos/mckinsey.png' },
  { name: 'Goldman Sachs', path: '/logos/goldman-sachs.png' },
  { name: 'Meta', path: '/logos/Meta.png' },
  { name: 'apple', path: '/logos/apple.svg' },
];

export default function TrustedBySection() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-center text-lg font-semibold leading-8 text-zinc-900">
            Nuestros Expertos Provienen de
          </h2>
          <div className="mx-auto mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => (
              <div key={company.name} className="flex justify-center">
                <Image
                  src={company.path}
                  alt={company.name}
                  width={158}
                  height={48}
                  className="filter grayscale transition duration-300 ease-in-out hover:filter-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}