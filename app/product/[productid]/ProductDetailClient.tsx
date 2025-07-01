// --- NUEVO ARCHIVO: app/product/[productid]/ProductDetailClient.tsx ---

'use client';



import React from 'react';

import Image from 'next/image';

import Link from 'next/link';

import { type Product, type Review } from '@/types';

import { BuyNowButton } from '@/components/BuyNowButton';

import RatingStars from '@/components/RatingStars';

import { ReviewsSection } from '@/components/reviews/ReviewsSection';

import { Briefcase, Target, Zap } from 'lucide-react';



interface ProductDetailClientProps {

    product: Product;

    initialReviews: Review[];

}



// Función helper para los cálculos financieros

function calculateFinancials(financials: Product['financials']) {

    if (!financials || typeof financials.initial_investment !== 'number' || typeof financials.monthly_revenue !== 'number') return null;

    const { initial_investment, monthly_revenue, fixed_costs_monthly, variable_cost_per_unit } = financials;

    if (initial_investment <= 0) return { breakevenMonths: 'N/A', roi: 'N/A' };

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



    return (

        <div className="bg-slate-50">

            <div className="container mx-auto px-4 py-8 sm:py-12">

                <nav aria-label="Breadcrumb" className="mb-8 text-sm">

                    <ol className="flex items-center space-x-2 text-slate-500">

                        <li><Link href="/" className="hover:underline hover:text-accent">Inicio</Link></li>

                        <li><span className="mx-2">/</span></li>

                        <li><Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:underline hover:text-accent">{product.category}</Link></li>

                        <li><span className="mx-2">/</span></li>

                        <li className="font-semibold text-slate-700" aria-current="page">{product.title}</li>

                    </ol>

                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    <div className="lg:col-span-3 space-y-8">

                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-white">

                            {product.previewImageURL ? (

                                <Image src={product.previewImageURL} alt={`Imagen de ${product.title}`} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />

                            ) : (

                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">

                                    <span className="text-sm text-slate-400">Imagen no disponible</span>

                                </div>

                            )}

                        </div>

                        {product.executiveSummary && (

                            <div className="bg-white border border-slate-200 rounded-lg p-6">

                                <h2 className="font-serif text-2xl font-bold text-slate-800">Resumen Ejecutivo</h2>

                                <div className="prose prose-slate max-w-none mt-4 text-slate-600">

                                    <p className="whitespace-pre-wrap">{product.executiveSummary}</p>

                                </div>

                            </div>

                        )}

                        {financialMetrics && (

                            <div className="bg-white border border-slate-200 rounded-lg p-6">

                                <h3 className="font-serif text-2xl font-bold text-slate-800">Indicadores Clave</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">

                                    <div className="bg-green-50 p-4 rounded-lg text-center">

                                        <p className="text-sm text-green-700 font-semibold">Punto de Equilibrio</p>

                                        <p className="text-3xl font-bold text-green-900">{financialMetrics.breakevenMonths} <span className="text-lg font-medium">meses</span></p>

                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg text-center">

                                        <p className="text-sm text-blue-700 font-semibold">ROI (Primer Año)</p>

                                        <p className="text-3xl font-bold text-blue-900">{financialMetrics.roi}%</p>

                                    </div>

                                </div>

                            </div>

                        )}

                        <div className="bg-white border border-slate-200 rounded-lg p-6">

                            <h2 className="font-serif text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2">Descripción Detallada</h2>

                            <div className="prose prose-slate max-w-none mt-4 text-slate-600">

                                <p className="whitespace-pre-wrap">{product.description || "No hay descripción disponible."}</p>

                            </div>

                        </div>

                        {marketAnalysis && (

                            <div className="bg-white border border-slate-200 rounded-lg p-6">

                                <h3 className="font-serif text-2xl font-bold text-slate-800">Análisis Estratégico</h3>

                                <div className="mt-4 space-y-4">

                                    <div className="flex items-start gap-3"><Briefcase className="w-5 h-5 text-accent flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-slate-700">Mercado</h4><p className="text-sm text-slate-600">Implementado en {marketAnalysis.location_country} con un tamaño estimado de {Number(marketAnalysis.market_size).toLocaleString('es-ES')}€.</p></div></div>

                                    <div className="flex items-start gap-3"><Target className="w-5 h-5 text-accent flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-slate-700">Cliente Ideal</h4><p className="text-sm text-slate-600">{marketAnalysis.customer_profile_summary}</p></div></div>

                                    <div className="flex items-start gap-3"><Zap className="w-5 h-5 text-accent flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-slate-700">Fortalezas</h4><p className="text-sm text-slate-600">{marketAnalysis.strengths || 'No especificado'}</p></div></div>

                                </div>

                            </div>

                        )}

                        <div id="reviews-section" className="bg-white border border-slate-200 rounded-lg">

                            <ReviewsSection productId={product.id!} initialReviews={initialReviews} />

                        </div>

                    </div>

                    <div className="lg:col-span-2">

                        <div className="sticky top-24">

                            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">{product.title}</h1>

                            <div className="mt-2 text-sm text-slate-600">

                                {product.sellerName && (

                                    product.sellerUsername ? (

                                        <Link href={`/seller/${product.sellerUsername}`} className="hover:underline">

                                            Vendido por <span className="font-semibold text-accent">{product.sellerName}</span>

                                        </Link>

                                    ) : (

                                        <span>Vendido por <span className="font-semibold text-accent">{product.sellerName}</span></span>

                                    )

                                )}

                            </div>

                            <div className="mt-4 flex items-center">

                                <RatingStars rating={product.averageRating || 0} />

                                <a href="#reviews-section" className="ml-3 text-sm font-medium text-accent hover:text-accent-hover">

                                ({product.reviewCount || 0} reseñas)

                                </a>

                            </div>

                            <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6 space-y-6">

                                <div>

                                    <p className="text-sm text-slate-600">Precio</p>

                                    <p className="text-4xl font-bold text-slate-800 mt-1">

                                        ${product.price.toFixed(2)} <span className="text-base font-medium text-slate-500">{product.currency}</span>

                                    </p>

                                </div>

                                <BuyNowButton productId={product.id!} price={product.price} productName={product.title} productDescription={product.description || ''} currency={product.currency} />

                                <p className="text-xs text-center text-slate-500">Pago seguro y encriptado con Stripe.</p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}