
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from './star-rating'
import { DistanceBadge } from './distance-badge'
import { NavigateButton } from './navigate-button'
import { MapPin, Accessibility, Eye, Ear, Users, Navigation } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Place } from '@prisma/client'

interface PlaceCardProps {
  place: Place & {
    _count?: {
      ratings: number
      comments: number
    }
    distance?: number
  }
}

const placeTypeLabels = {
  RESTAURANT: 'Restaurant',
  CINEMA: 'Cinéma',
  PARC: 'Parc',
  MUSEE: 'Musée',
  BAR: 'Bar/Café',
  TOILETTES_PUBLIQUES: 'Toilettes publiques',
  HOPITAL: 'Hôpital',
  ECOLE: 'École',
  UNIVERSITE: 'Université',
  TRANSPORT: 'Transport',
  HOTEL: 'Hôtel',
  MAGASIN: 'Magasin',
  BUREAU: 'Bureau',
  AUTRE: 'Autre'
}

const getAccessibilityColor = (rating: number) => {
  if (rating >= 4) return 'bg-green-100 text-green-800 border-green-200'
  if (rating >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  if (rating >= 2) return 'bg-orange-100 text-orange-800 border-orange-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer h-full">
        {place.imageUrl && (
          <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-t-lg">
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardHeader className="pb-3 px-3 sm:px-4">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 flex-1">
              {place.name}
            </CardTitle>
            <div className="flex flex-col gap-1 shrink-0 items-end">
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {placeTypeLabels[place.type]}
              </Badge>
              {place.distance !== undefined && (
                <DistanceBadge distance={place.distance} className="text-xs" />
              )}
            </div>
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-1">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="line-clamp-1">{place.address}, {place.city}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-3 sm:px-4">
          <div className="space-y-2">
            {/* Mobilité réduite */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Accessibility className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Mobilité</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="hidden xs:block">
                  <StarRating rating={place.averageMobilityRating} readOnly size="sm" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1.5 py-0.5 ${getAccessibilityColor(place.averageMobilityRating)}`}
                >
                  {place.averageMobilityRating.toFixed(1)}
                </Badge>
              </div>
            </div>

            {/* Déficience visuelle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Vision</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="hidden xs:block">
                  <StarRating rating={place.averageVisualRating} readOnly size="sm" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1.5 py-0.5 ${getAccessibilityColor(place.averageVisualRating)}`}
                >
                  {place.averageVisualRating.toFixed(1)}
                </Badge>
              </div>
            </div>

            {/* Déficience auditive */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Ear className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Audition</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="hidden xs:block">
                  <StarRating rating={place.averageHearingRating} readOnly size="sm" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1.5 py-0.5 ${getAccessibilityColor(place.averageHearingRating)}`}
                >
                  {place.averageHearingRating.toFixed(1)}
                </Badge>
              </div>
            </div>

            {/* Accessibilité toilettes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Toilettes</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="hidden xs:block">
                  <StarRating rating={place.averageToiletRating} readOnly size="sm" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1.5 py-0.5 ${getAccessibilityColor(place.averageToiletRating)}`}
                >
                  {place.averageToiletRating.toFixed(1)}
                </Badge>
              </div>
            </div>

            {/* Statistiques et navigation */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 gap-2">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-xs text-gray-500 truncate">
                  {place.ratingsCount} avis
                </span>
                {place._count?.comments && (
                  <span className="text-xs text-gray-500 truncate">
                    {place._count.comments} commentaires
                  </span>
                )}
              </div>
              <div onClick={(e) => e.preventDefault()} className="shrink-0">
                <NavigateButton 
                  place={{
                    name: place.name,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    address: place.address,
                    city: place.city
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-1 h-7"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
