'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Product, type Review } from '@/types';
import { BuyNowButton } from '@/components/BuyNowButton';
import RatingStars from '@/components/RatingStars';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { Briefcase, Target, Zap, CheckCircle } from 'lucide-react';

interface ProductDetailClientProps {
    product: Product;
    initialReviews: Review[];
}

export default function ProductDetailClient({ product, initialReviews }: ProductDetailClientProps) {

    return (
        <div className="bg-white">
            <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-slate-500">
                        <li><Link href="/" className="hover:text-orange-600">Inicio</Link></li>
                        <li><span className="mx-1">/</span></li>
                        <li><Link href={`/search?category=${product.category}`} className="hover:text-orange-600 capitalize">{product.category.replace(/_/g, ' ')}</Link></li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-7">
                    {/* --- Columna Izquierda: Contenido Principal --- */}
                    <div className="lg:col-span-4">
                        <div className="space-y-12">
                            {/* Título para móviles */}
                            <div className="lg:hidden">
                                <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900">{product.title}</h1>
                                {/* Info del vendedor para móviles */}
                                <SellerInfo product={product} className="mt-2" />
                            </div>

                            {/* Imagen Principal */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-slate-50">
                                {product.previewImageURL ? (
                                    <Image src={product.previewImageURL} alt={`Imagen de ${product.title}`} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center"><span className="text-sm text-slate-400">Imagen no disponible</span></div>
                                )}
                            </div>

                            {/* Descripción Detallada */}
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-zinc-800">Sobre esta Herramienta</h2>
                                <div className="prose prose-slate mt-4 max-w-none text-slate-600 whitespace-pre-wrap">
                                    {product.description || "No hay descripción disponible."}
                                </div>
                            </div>
                            
                            {/* Separador Visual */}
                            <hr className="border-slate-200" />
                            
                            {/* Sección de Reseñas */}
                            <div id="reviews-section">
                                <ReviewsSection productId={product.id!} initialReviews={initialReviews} />
                            </div>
                        </div>
                    </div>

                    {/* --- Columna Derecha: Barra de Compra (Sticky) --- */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            {/* Título para escritorio */}
                            <div className="hidden lg:block">
                                <h1 className="font-serif text-4xl font-bold tracking-tight text-zinc-900 leading-tight">{product.title}</h1>
                                <SellerInfo product={product} className="mt-3" />
                            </div>

                            {/* Caja de Compra */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                                <p className="text-4xl font-bold text-zinc-900">
                                    ${product.price.toFixed(2)} <span className="text-base font-medium text-slate-500">{product.currency}</span>
                                </p>
                                <p className="mt-1 text-sm text-slate-500">Pago único, acceso de por vida.</p>
                                
                                <BuyNowButton productId={product.id!} price={product.price} productName={product.title} productDescription={product.description || ''} currency={product.currency} />
                                
                                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm">
                                    <h3 className="font-semibold text-zinc-900">¿Qué incluye tu compra?</h3>
                                    <p className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> Acceso instantáneo a todos los archivos.</p>
                                    <p className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> Licencia de uso comercial.</p>
                                    <p className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> Actualizaciones futuras gratuitas.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Pequeño componente para no repetir el código de la info del vendedor
const SellerInfo = ({ product, className }: { product: Product, className?: string }) => (
    <div className={`flex items-center gap-4 ${className}`}>
        <Link href={`/seller/${product.sellerUsername}`} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                <Image src={product.sellerAvatarUrl || '/images/default-avatar.png'} alt={`Avatar de ${product.sellerName}`} fill className="object-cover" />
            </div>
            <div>
                <p className="text-sm font-semibold text-zinc-900 group-hover:text-orange-600">{product.sellerName}</p>
                <p className="text-sm text-slate-500">Vendedor Verificado</p>
            </div>
        </Link>
        <div className="flex items-center">
            <RatingStars rating={product.averageRating || 0} />
            <a href="#reviews-section" className="ml-2 text-sm text-slate-500 hover:text-orange-600">
                ({product.reviewCount || 0})
            </a>
        </div>
    </div>
);