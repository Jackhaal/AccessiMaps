

'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MapPin, Check } from 'lucide-react'

interface AddressResult {
  properties: {
    label: string
    name: string
    postcode: string
    city: string
    context: string
    score: number
  }
  geometry: {
    coordinates: [number, number] // [longitude, latitude]
  }
}

interface SelectedAddress {
  fullAddress: string
  name: string
  city: string
  postalCode: string
  latitude: number
  longitude: number
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: SelectedAddress) => void
  placeholder?: string
  initialValue?: string
  className?: string
}

export function AddressAutocomplete({ 
  onAddressSelect, 
  placeholder = "Tapez une adresse française...",
  initialValue = "",
  className 
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSelected, setIsSelected] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Debounce pour éviter trop de requêtes API
  useEffect(() => {
    if (query.length < 3 || isSelected) {
      setResults([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, isSelected])

  const searchAddresses = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      // API Adresse française officielle
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(searchQuery)}&limit=8&autocomplete=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.features || [])
        setShowResults(true)
        setSelectedIndex(-1)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresse:', error)
      setResults([])
    }
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsSelected(false)
    
    if (value.length < 3) {
      setShowResults(false)
      setResults([])
    }
  }

  const selectAddress = (address: AddressResult) => {
    const selectedAddress: SelectedAddress = {
      fullAddress: address.properties.label,
      name: address.properties.name || '',
      city: address.properties.city,
      postalCode: address.properties.postcode,
      latitude: address.geometry.coordinates[1],
      longitude: address.geometry.coordinates[0]
    }

    setQuery(address.properties.label)
    setIsSelected(true)
    setShowResults(false)
    setResults([])
    onAddressSelect(selectedAddress)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          selectAddress(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleBlur = () => {
    // Délai pour permettre le clic sur un résultat
    setTimeout(() => {
      setShowResults(false)
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        {isSelected && (
          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
        )}
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (results.length > 0 && !isSelected) {
              setShowResults(true)
            }
          }}
          className={`pl-10 ${isSelected ? 'pr-10' : ''} ${className}`}
          autoComplete="off"
        />
      </div>

      {/* Résultats de l'autocomplétion */}
      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto border shadow-lg bg-white">
          <div ref={resultsRef} className="py-1">
            {results.map((address, index) => (
              <div
                key={`${address.properties.label}-${index}`}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
                onClick={() => selectAddress(address)}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {address.properties.name || address.properties.label.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-1 mt-1">
                      {address.properties.label}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {address.properties.postcode}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {Math.round(address.properties.score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Message d'aide */}
      <p className="text-xs text-gray-500 mt-1">
        Tapez au moins 3 caractères pour rechercher une adresse française
      </p>
    </div>
  )
}
