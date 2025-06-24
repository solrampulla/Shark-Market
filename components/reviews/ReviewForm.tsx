// --- ARCHIVO CORREGIDO: components/reviews/ReviewForm.tsx ---
// CORRECCIÓN: Se elimina el uso de la utilidad 'cn' que no existe en tu proyecto.
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  const buttonStyle = "w-full sm:w-auto flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed";
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold text-lg text-slate-800">Escribe tu reseña</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Tu calificación:</p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type="button"
                  key={starValue}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starValue)}
                  className="p-1 rounded-full transition-transform transform hover:scale-125"
                  aria-label={`Calificar con ${starValue} estrellas`}
                >
                  <Star
                    // ---> CAMBIO: Usamos una plantilla de string en lugar de 'cn'
                    className={`w-6 h-6 transition-colors ${
                      starValue <= (hoverRating || rating)
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                    fill="currentColor"
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="text-sm font-medium text-slate-600 sr-only">Tu comentario:</label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent sm:text-sm"
            placeholder="Describe tu experiencia con este producto..."
            required
            minLength={10}
            disabled={isSubmitting}
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.length < 10}
            className={buttonStyle}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </div>
      </form>
    </div>
  );
}