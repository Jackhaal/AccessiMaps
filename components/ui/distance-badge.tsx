

'use client'

import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import { formatDistance } from '@/lib/distance'

interface DistanceBadgeProps {
  distance: number
  className?: string
}

export function DistanceBadge({ distance, className }: DistanceBadgeProps) {
  const getDistanceColor = (distance: number) => {
    if (distance <= 0.5) return 'bg-green-100 text-green-800 border-green-200'
    if (distance <= 2) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (distance <= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <Badge 
      variant="outline" 
      className={`${getDistanceColor(distance)} ${className}`}
    >
      <MapPin className="w-3 h-3 mr-1" />
      {formatDistance(distance)}
    </Badge>
  )
}
