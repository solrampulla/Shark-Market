// --- ARCHIVO FINAL Y DEFINITIVO ---
'use server';

import { MetadataRoute } from 'next';
import { getAllPublicProductsForSitemap } from './actions/product.actions';
import { getAllPublicSellersForSitemap } from './actions/user.actions';

// Definimos los tipos exactos que devuelven nuestras acciones para el sitemap
type SitemapProduct = {
  id: string;
  updatedAt: { toDate: () => Date; } | null;
};

type SitemapSeller = {
  username: string;
  updatedAt: { toDate: () => Date; } | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/upload`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // --- CORRECCIÓN FINAL ---
  // Ahora el tipo del parámetro 'product' coincide con lo que devuelve la acción.
  const products = await getAllPublicProductsForSitemap();
  const productRoutes = products.map((product: SitemapProduct) => ({
    url: `${BASE_URL}/product/${product.id}`,
    // Usamos el método .toDate() del Timestamp de Firebase
    lastModified: product.updatedAt ? product.updatedAt.toDate() : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  const sellers = await getAllPublicSellersForSitemap();
  const sellerRoutes = sellers.map((seller: SitemapSeller) => ({
    url: `${BASE_URL}/seller/${seller.username}`,
    lastModified: seller.updatedAt ? seller.updatedAt.toDate() : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...sellerRoutes];
}