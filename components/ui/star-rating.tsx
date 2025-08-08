
'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readOnly = false, 
  size = 'md',
  showNumber = false 
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (value: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (!readOnly) {
      setHoveredRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoveredRating(0)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= displayRating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
