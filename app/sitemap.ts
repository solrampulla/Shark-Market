'use server';

import { MetadataRoute } from 'next';
// CORRECCIÓN: Importamos el tipo Timestamp para usarlo en nuestra función de ayuda
import { type Timestamp } from 'firebase-admin/firestore';
import { getAllPublicProductsForSitemap } from './actions/product.actions';
import { getAllPublicSellersForSitemap } from './actions/user.actions';

// --- FUNCIÓN HELPER CORREGIDA ---
// Ahora maneja correctamente el objeto Timestamp de Firebase
const getLastModifiedDate = (item: { updatedAt?: Timestamp | null, createdAt?: Timestamp | null }): Date => {
  const timestamp = item.updatedAt || item.createdAt;
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sharkmarket.co';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${BASE_URL}/productos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/vender`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const products = await getAllPublicProductsForSitemap();
  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: getLastModifiedDate(product),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  const sellers = await getAllPublicSellersForSitemap();
  const sellerRoutes = sellers.map((seller) => ({
    url: `${BASE_URL}/seller/${seller.username}`,
    lastModified: getLastModifiedDate(seller),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...sellerRoutes];
}