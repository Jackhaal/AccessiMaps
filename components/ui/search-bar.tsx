
'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  showFilters?: boolean
}

export interface SearchFilters {
  type: string
  minRating: string
  minToiletRating: string
  city: string
}

const placeTypes = [
  { value: 'all', label: 'Tous les types' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CINEMA', label: 'Cinéma' },
  { value: 'PARC', label: 'Parc' },
  { value: 'MUSEE', label: 'Musée' },
  { value: 'BAR', label: 'Bar/Café' },
  { value: 'TOILETTES_PUBLIQUES', label: 'Toilettes publiques' },
  { value: 'HOPITAL', label: 'Hôpital' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'MAGASIN', label: 'Magasin' },
  { value: 'AUTRE', label: 'Autre' }
]

const ratingOptions = [
  { value: 'all', label: 'Toutes les notes' },
  { value: '4', label: '4+ étoiles' },
  { value: '3', label: '3+ étoiles' },
  { value: '2', label: '2+ étoiles' },
  { value: '1', label: '1+ étoiles' }
]

export function SearchBar({ onSearch, showFilters = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    minRating: 'all',
    minToiletRating: 'all',
    city: ''
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showFilters)

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(query, newFilters)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all',
      minRating: 'all',
      minToiletRating: 'all',
      city: ''
    }
    setFilters(clearedFilters)
    onSearch(query, clearedFilters)
  }

  const hasActiveFilters = filters.type !== 'all' || filters.minRating !== 'all' || 
                          filters.minToiletRating !== 'all' || filters.city !== ''

  return (
    <div className="w-full space-y-4">
      {/* Barre de recherche principale - Optimisée pour mobile */}
      <div className="flex flex-col xs:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Rechercher un lieu, une adresse..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 text-base h-12 bg-white border-2 border-gray-200 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSearch}
            size="lg"
            className="flex-1 xs:flex-none px-4 xs:px-6 h-12 bg-blue-600 hover:bg-blue-700"
          >
            <Search className="w-4 h-4 mr-2 xs:inline hidden" />
            <span className="xs:hidden">Rechercher</span>
            <span className="hidden xs:inline">Rechercher</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 xs:px-4 h-12 border-2 relative ${hasActiveFilters ? 'border-blue-300 bg-blue-50' : ''}`}
          >
            <Filter className="w-4 h-4" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <Card className="border-2 border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            {/* Header des filtres */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Filtres avancés</h3>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Effacer
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                  className="xs:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Grille des filtres - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type de lieu</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {placeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Accessibilité minimum</label>
                <Select value={filters.minRating} onValueChange={(value) => handleFilterChange('minRating', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Toilettes accessibles</label>
                <Select value={filters.minToiletRating} onValueChange={(value) => handleFilterChange('minToiletRating', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Paris, Lyon..."
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
