
'use client'

import { useState, useEffect } from 'react'
import { PlaceCard } from '@/components/ui/place-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Loader2 } from 'lucide-react'
import type { Place } from '@prisma/client'

interface NearbyPlacesProps {
  className?: string
  maxResults?: number
}

type PlaceWithCount = Place & {
  _count?: {
    ratings: number
    comments: number
  }
}

export function NearbyPlaces({ 
  className, 
  maxResults = 8
}: NearbyPlacesProps) {
  const [places, setPlaces] = useState<PlaceWithCount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaces = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/places?limit=${maxResults}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des lieux')
      }
      
      const data = await response.json()
      setPlaces(data.places || [])
    } catch (err) {
      setError('Impossible de charger les lieux')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [maxResults])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Lieux récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Chargement des lieux...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Lieux récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchPlaces}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Lieux récents
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {places.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun lieu disponible
            </h3>
            <p className="text-gray-600 mb-4">
              Les lieux ajoutés apparaîtront ici
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/places/add'}>
              Ajouter un lieu
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {places.length >= maxResults && (
              <div className="text-center mt-6">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/places'}
                >
                  Voir tous les lieux
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
