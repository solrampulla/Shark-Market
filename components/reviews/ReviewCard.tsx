// --- ARCHIVO FINAL Y CORREGIDO: components/reviews/ReviewCard.tsx ---
'use client';

import Image from 'next/image';
// ---> CORRECCIÓN: Apuntamos a nuestro archivo central de tipos.
import { type Review } from '@/types';
import RatingStars from '@/components/RatingStars';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="p-6 border-b border-slate-200 last:border-b-0">
      <div className="flex items-start space-x-4">
        <Image
          src={review.buyerAvatarUrl || '/default-avatar.png'}
          alt={`Avatar de ${review.buyerName}`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-800">{review.buyerName}</p>
              <p className="text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <RatingStars rating={review.rating} starSize="text-sm" />
          </div>
          <p className="mt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        </div>
      </div>
    </article>
  );
}