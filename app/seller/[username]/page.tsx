// --- ARCHIVO FINAL Y CORREGIDO: app/seller/[username]/page.tsx ---
// CAMBIO: Se añade la función generateMetadata para el SEO dinámico.

import { notFound } from 'next/navigation';
import { type Metadata, type ResolvingMetadata } from 'next';

// Importaciones de acciones y tipos desde sus ubicaciones correctas
import { getSellerPublicProfileAction } from '@/app/actions/user.actions';
import { type Product, type ProfileData } from '@/types';

import ProfileHeader from '@/components/seller/ProfileHeader';
import ProductCard from '@/components/ProductCard';

interface SellerPageProps {
  params: {
    username: string;
  };
}

// ---> NUEVO: Función para generar metadatos dinámicos para el SEO del vendedor
export async function generateMetadata(
  { params }: SellerPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;
  const result = await getSellerPublicProfileAction(username);
 
  if (!result.success || !result.profile) {
    return {
      title: 'Perfil no encontrado | Founder Market',
    }
  }
 
  const profile = result.profile;
  const pageTitle = `${profile.full_name || 'Vendedor'} | Founder Market`;
  const pageDescription = profile.professional_title || `Explora todos los productos de ${profile.full_name} en Founder Market.`;
 
  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

// El componente de la página sigue siendo un Server Component que carga datos
export default async function SellerPage({ params }: SellerPageProps) {
  const { username } = params;

  const result = await getSellerPublicProfileAction(username);

  if (!result.success || !result.profile) {
    notFound();
  }

  // Aseguramos los tipos para TypeScript
  const profile = result.profile as ProfileData;
  const products = (result.products as Product[]) || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <ProfileHeader profile={profile} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Productos de {profile.full_name || 'este vendedor'}</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id!}
                  id={product.id!}
                  isWishlisted={false} 
                  title={product.title}
                  category={product.category}
                  price={product.price}
                  image_url={product.previewImageURL}
                  detailUrl={`/product/${product.id}`}
                  altText={`Imagen de ${product.title}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-500">Este vendedor todavía no tiene productos publicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}