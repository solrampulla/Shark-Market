// --- ARCHIVO FINAL CON TODAS LAS CORRECCIONES ---
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Product, type Review } from '@/types';
import { BuyNowButton } from '@/components/BuyNowButton';
// --- CORRECCIÓN 1: Ruta de importación corregida ---
import RatingStars from '@/components/RatingStars'; 
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { Briefcase, Target, Zap } from 'lucide-react';

interface ProductDetailClientProps {
    product: Product;
    initialReviews: Review[];
}

function calculateFinancials(financials: Product['financials']) {
    if (!financials) return null;
    const { initial_investment, monthly_revenue, fixed_costs_monthly, variable_cost_per_unit } = financials;
    if (initial_investment <= 0 || monthly_revenue <= 0) return { breakevenMonths: 'N/A', roi: 'N/A' };
    const monthly_gross_profit = monthly_revenue * (1 - ((variable_cost_per_unit || 0) / 100));
    const monthly_net_profit = monthly_gross_profit - (fixed_costs_monthly || 0);
    if (monthly_net_profit <= 0) return { breakevenMonths: 'No rentable', roi: -100 };
    const breakevenMonths = initial_investment / monthly_net_profit;
    const annual_net_profit = monthly_net_profit * 12;
    const roi = (annual_net_profit / initial_investment) * 100;
    return {
        breakevenMonths: breakevenMonths.toFixed(1),
        roi: roi.toFixed(1)
    };
}

export default function ProductDetailClient({ product, initialReviews }: ProductDetailClientProps) {
    const financialMetrics = calculateFinancials(product.financials);
    const marketAnalysis = product.marketAnalysis;
    const displayImage = product.sellerImageUrl || product.coverImageUrl;

    return (
        <div className="bg-zinc-50">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <nav aria-label="Breadcrumb" className="mb-8 text-sm">
                    <ol className="flex items-center space-x-2 text-zinc-500">
                        <li><Link href="/" className="hover:text-orange-600">Inicio</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li><Link href={`/productos?category=${encodeURIComponent(product.category)}`} className="hover:text-orange-600">{product.category}</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li className="font-semibold text-zinc-700" aria-current="page">{product.title}</li>
                    </ol>
                </nav>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* --- COLUMNA PRINCIPAL DE CONTENIDO --- */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 bg-white">
                            {displayImage ? (
                                <Image src={displayImage} alt={`Imagen de ${product.title}`} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                                    <span className="text-sm text-zinc-400">Imagen no disponible</span>
                                </div>
                            )}
                        </div>
                        {product.description && (
                            <div className="bg-white border border-zinc-200 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-zinc-900">Descripción Detallada</h2>
                                <div className="prose prose-zinc max-w-none mt-4 text-zinc-600">
                                    <p className="whitespace-pre-wrap">{product.description}</p>
                                </div>
                            </div>
                        )}
                        {/* ...Otras secciones... */}
                        <div id="reviews-section" className="bg-white border border-zinc-200 rounded-lg">
                            <ReviewsSection productId={product.id!} initialReviews={initialReviews} />
                        </div>
                    </div>
                    {/* --- BARRA LATERAL FIJA (STICKY) --- */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 space-y-6"> 
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">{product.title}</h1>
                            {product.seller && (
                                <div className="pt-2">
                                    <Link href={`/seller/${product.seller.id}`} className="flex items-center gap-4 group">
                                        <Image src={product.seller.imageUrl || '/images/default-avatar.png'} alt={product.seller.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 group-hover:text-orange-600">Vendido por {product.seller.name}</p>
                                            <p className="text-sm text-zinc-500">{product.seller.credential}</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <div className="flex items-center">
                                <RatingStars rating={product.averageRating || 0} />
                                <a href="#reviews-section" className="ml-3 text-sm font-medium text-orange-600 hover:text-orange-700">
                                ({product.reviewCount || 0} reseñas)
                                </a>
                            </div>
                            {/* CAJA DE COMPRA */}
                            <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
                                <div>
                                    <p className="text-sm text-zinc-600">Precio</p>
                                    <p className="text-4xl font-bold text-zinc-900 mt-1">
                                        ${product.price.toFixed(2)} <span className="text-base font-medium text-zinc-500">{product.currency}</span>
                                    </p>
                                </div>
                                {/* --- CORRECCIÓN 2: Pasamos todas las props necesarias a BuyNowButton --- */}
                                <BuyNowButton 
                                    productId={product.id!}
                                    price={product.price}
                                    productName={product.title}
                                    productDescription={product.description || ''}
                                    currency={product.currency}
                                />
                                <p className="text-xs text-center text-zinc-500">Pago seguro y encriptado con Stripe.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}