// --- FILE: components/RatingStars.tsx ---

import React from 'react';

interface RatingStarsProps {
  rating: number; // e.g., 4.5
  maxRating?: number; // e.g., 5
  starSize?: string; // e.g., 'text-lg', 'text-xl'
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxRating = 5, starSize = 'text-base' /* Default size */ }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  // Clamp empty stars to be non-negative
  const safeEmptyStars = Math.max(0, emptyStars);

  return (
    <div className={`flex text-yellow-400 ${starSize}`}>
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="ri-star-fill"></i>)}
      {hasHalfStar && <i key="half" className="ri-star-half-fill"></i>}
      {[...Array(safeEmptyStars)].map((_, i) => <i key={`empty-${i}`} className="ri-star-line text-gray-300"></i>)} {/* Use gray for empty */}
    </div>
  );
};

export default RatingStars;