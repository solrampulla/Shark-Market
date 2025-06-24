// --- ARCHIVO FINAL Y CORREGIDO: app/sitemap.ts ---
// CORRECCIÓN: Se añade una anotación de tipo explícita para guiar a TypeScript.
'use server';

import { MetadataRoute } from 'next';
import { getAllPublicProductsForSitemap } from './actions/product.actions';
import { getAllPublicSellersForSitemap } from './actions/user.actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ---> IMPORTANTE: Reemplaza esto con tu dominio real cuando lances la web
  const BASE_URL = 'https://www.foundermarket.com';

  // ---> CORRECCIÓN: Le decimos a TypeScript que este array es de tipo Sitemap.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/upload`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Páginas dinámicas de productos
  const products = await getAllPublicProductsForSitemap();
  const productRoutes = products.map(product => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.updatedAt ? product.updatedAt.toDate() : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  // Páginas dinámicas de vendedores
  const sellers = await getAllPublicSellersForSitemap();
  const sellerRoutes = sellers.map(seller => ({
    url: `${BASE_URL}/seller/${seller.username}`,
    lastModified: seller.updatedAt ? seller.updatedAt.toDate() : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Unimos todas las rutas
  return [...staticRoutes, ...productRoutes, ...sellerRoutes];
}