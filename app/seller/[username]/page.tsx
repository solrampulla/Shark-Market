import { notFound } from 'next/navigation';
import { type Metadata, type ResolvingMetadata } from 'next';

// Asumo que estas son las acciones correctas, si no, ajusta las importaciones
import { getSellerPublicProfileAction } from '@/app/actions/user.actions'; 
import { type Product, type ProfileData } from '@/types';

import ProfileHeader from '@/components/seller/ProfileHeader';
import ProductCard from '@/components/ProductCard';

interface SellerPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata(
  { params }: SellerPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;
  const result = await getSellerPublicProfileAction(username);
  
  if (!result.success || !result.profile) {
    return {
      title: 'Perfil no encontrado | Shark Market',
    }
  }
  
  const profile = result.profile;
  const pageTitle = `${profile.full_name || 'Vendedor'} | Shark Market`;
  const pageDescription = profile.professional_title || `Explora todos los productos de ${profile.full_name} en Shark Market.`;
  
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

export default async function SellerPage({ params }: SellerPageProps) {
  const { username } = params;
  const result = await getSellerPublicProfileAction(username);

  if (!result.success || !result.profile) {
    notFound();
  }

  const profile = result.profile as ProfileData;
  const products = (result.products as Product[]) || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <ProfileHeader profile={profile} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Activos de {profile.full_name || 'este vendedor'}</h2>
          
          {products.length > 0 ? (
            // Se añade 'items-stretch' para la alineación
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              {products.map((product, index) => (
                <ProductCard
                  key={product.id!}
                  product={product}
                  index={index} // Se añade el 'index' que faltaba
                />
              ))}
              {/* --- FIN DE LA CORRECCIÓN --- */}
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