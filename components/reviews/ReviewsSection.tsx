// --- ARCHIVO CORREGIDO: components/reviews/ReviewsSection.tsx ---
// CORRECCIÓN: Se separa la importación de tipos y de acciones.
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ---> CORRECCIÓN: Se importa el tipo desde '/types' y las acciones desde '/app/actions'.
import { type Review } from '@/types';
import { checkReviewEligibilityAction, submitReviewAction } from '@/app/actions';

import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

interface ReviewsSectionProps {
  productId: string;
  initialReviews: Review[];
}

export function ReviewsSection({ productId, initialReviews }: ReviewsSectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState(initialReviews);
  const [eligibility, setEligibility] = useState({ canReview: false, hasReviewed: false });
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        checkReviewEligibilityAction(currentUser.uid, productId)
          .then(setEligibility)
          .finally(() => setIsLoadingEligibility(false));
      } else {
        setIsLoadingEligibility(false);
      }
    });
    return () => unsubscribe();
  }, [productId]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña.');
      return;
    }
    setIsSubmitting(true);
    const result = await submitReviewAction(user.uid, productId, rating, comment);

    if (result.success) {
      toast.success(result.message);
      const newReview: Review = {
        id: new Date().toISOString(),
        productId,
        userId: user.uid,
        rating,
        comment,
        createdAt: Date.now(),
        buyerName: user.displayName || 'Tú',
        buyerAvatarUrl: user.photoURL
      };
      setReviews([newReview, ...reviews]);
      setEligibility({ canReview: false, hasReviewed: true });
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">
        Opiniones de Clientes
      </h2>
      
      {!isLoadingEligibility && eligibility.canReview && (
        <div className="mb-8">
          <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmitting} />
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-2 divide-y divide-slate-100">
            {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6">
            <p className="text-slate-500">Este producto todavía no tiene reseñas. ¡Sé el primero en dejar una!</p>
        </div>
      )}
    </div>
  );
}