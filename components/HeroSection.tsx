// --- FILE: components/HeroSection.tsx ---
import Link from 'next/link';
import Image from 'next/image';
import HeroSearchBar from './HeroSearchBar';

const HeroSection = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text-DEFAULT leading-tight">
              Herramientas de expertos listas para usar
            </h1>
            <div className="w-24 h-1.5 bg-accent my-8 mx-auto md:mx-0"></div>
            <HeroSearchBar />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
              alt="Portátil mostrando gráficos de negocio en un escritorio moderno"
              width={600}
              height={400}
              className="rounded-lg shadow-xl object-cover"
              priority 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;