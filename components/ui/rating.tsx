import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  readonly = true,
  onRatingChange,
  className
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(null);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating ?? rating;

    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= Math.floor(displayRating);
      const isHalfFilled = i === Math.ceil(displayRating) && displayRating % 1 !== 0;
      
      stars.push(
        <button
          key={i}
          type="button"
          className={cn(
            'relative transition-colors',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          disabled={readonly}
        >
          {isHalfFilled ? (
            <div className="relative">
              <Star 
                className={cn(
                  sizes[size],
                  'text-gray-300'
                )}
                fill="currentColor"
              />
              <StarHalf 
                className={cn(
                  sizes[size],
                  'absolute inset-0 text-yellow-400'
                )}
                fill="currentColor"
              />
            </div>
          ) : (
            <Star 
              className={cn(
                sizes[size],
                isFilled ? 'text-yellow-400' : 'text-gray-300',
                !readonly && hoverRating !== null && i <= hoverRating && 'text-yellow-400'
              )}
              fill="currentColor"
            />
          )}
        </button>
      );
    }

    return stars;
  };

  return (
    <div 
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showValue && (
        <span className={cn('ml-2 font-medium text-gray-600', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export { Rating };