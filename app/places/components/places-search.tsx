
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar, SearchFilters } from '@/components/ui/search-bar'
import { PlaceCard } from '@/components/ui/place-card'
import { Button } from '@/components/ui/button'
import { Loader2, MapPin } from 'lucide-react'
import type { Place } from '@prisma/client'

interface PlaceWithCounts extends Place {
  _count: {
    ratings: number
    comments: number
  }
}

interface SearchResponse {
  places: PlaceWithCounts[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function PlacesSearch() {
  const searchParams = useSearchParams()
  const [places, setPlaces] = useState<PlaceWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    type: 'all',
    minRating: 'all',
    minToiletRating: 'all',
    city: ''
  })
  const [currentQuery, setCurrentQuery] = useState('')

  // Charger les paramètres depuis l'URL
  useEffect(() => {
    const q = searchParams?.get('q') || ''
    const type = searchParams?.get('type') || 'all'
    const minRating = searchParams?.get('minRating') || 'all'
    const minToiletRating = searchParams?.get('minToiletRating') || 'all'
    const city = searchParams?.get('city') || ''

    setCurrentQuery(q)
    setCurrentFilters({ type, minRating, minToiletRating, city })
    
    // Charger les lieux avec les paramètres initiaux
    fetchPlaces(q, { type, minRating, minToiletRating, city }, 1)
  }, [searchParams])

  const fetchPlaces = async (query: string, filters: SearchFilters, page: number = 1) => {
    setLoading(true)
    
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.minRating !== 'all') params.append('minRating', filters.minRating)
      if (filters.minToiletRating !== 'all') params.append('minToiletRating', filters.minToiletRating)
      if (filters.city) params.append('city', filters.city)
      
      params.append('page', page.toString())
      params.append('limit', '12')

      const response = await fetch(`/api/places?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche')
      }

      const data: SearchResponse = await response.json()
      
      if (page === 1) {
        setPlaces(data.places)
      } else {
        setPlaces(prev => [...prev, ...data.places])
      }
      
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erreur lors du chargement des lieux:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUrl = (query: string, filters: SearchFilters) => {
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (filters.type !== 'all') params.append('type', filters.type)
    if (filters.minRating !== 'all') params.append('minRating', filters.minRating)
    if (filters.minToiletRating !== 'all') params.append('minToiletRating', filters.minToiletRating)
    if (filters.city) params.append('city', filters.city)
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }

  const handleSearch = (query: string, filters: SearchFilters) => {
    setCurrentQuery(query)
    setCurrentFilters(filters)
    fetchPlaces(query, filters, 1)
    updateUrl(query, filters)
  }

  const handleLoadMore = () => {
    fetchPlaces(currentQuery, currentFilters, pagination.page + 1)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Barre de recherche */}
      <SearchBar onSearch={handleSearch} showFilters={true} />

      {/* Résultats */}
      {loading && pagination.page === 1 ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Recherche en cours...</span>
        </div>
      ) : (
        <>
          {/* Header des résultats */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 text-sm sm:text-base">
                {pagination.total} lieu{pagination.total > 1 ? 'x' : ''} trouvé{pagination.total > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Grille des lieux - Responsive améliorée */}
          {places.length > 0 ? (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>

              {/* Bouton charger plus */}
              {pagination.page < pagination.pages && (
                <div className="flex justify-center pt-6 sm:pt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 w-full xs:w-auto max-w-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      `Charger plus (${pagination.total - places.length} restants)`
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12 px-4">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun lieu trouvé
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Essayez de modifier vos critères de recherche ou ajoutez un nouveau lieu
              </p>
              <Button asChild className="w-full xs:w-auto">
                <a href="/places/add">Ajouter un lieu</a>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
