
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, MapPin, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Place {
  id: string
  name: string
  address: string
  city: string
  type: string
  averageMobilityRating: number
  averageVisualRating: number
  averageHearingRating: number
  averageToiletRating: number
  ratingsCount: number
  createdAt: string
}

export default function PlacesAdmin() {
  const router = useRouter()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPlaces()
    }
  }, [mounted])

  useEffect(() => {
    const filtered = places.filter(place =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPlaces(filtered)
  }, [places, searchTerm])

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/admin/places')
      if (response.ok) {
        const data = await response.json()
        setPlaces(data)
      }
    } catch (error) {
      console.error('Error fetching places:', error)
      toast.error('Erreur lors du chargement des lieux')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (placeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return

    try {
      const response = await fetch(`/api/admin/places/${placeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlaces(places.filter(place => place.id !== placeId))
        toast.success('Lieu supprimé avec succès')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting place:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      RESTAURANT: 'bg-orange-100 text-orange-800',
      CINEMA: 'bg-purple-100 text-purple-800',
      PARC: 'bg-green-100 text-green-800',
      MUSEE: 'bg-blue-100 text-blue-800',
      BAR: 'bg-red-100 text-red-800',
      TOILETTES_PUBLIQUES: 'bg-gray-100 text-gray-800',
      HOPITAL: 'bg-red-100 text-red-800',
      ECOLE: 'bg-yellow-100 text-yellow-800',
      TRANSPORT: 'bg-indigo-100 text-indigo-800',
      HOTEL: 'bg-pink-100 text-pink-800',
      MAGASIN: 'bg-cyan-100 text-cyan-800',
      AUTRE: 'bg-gray-100 text-gray-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getAverageRating = (place: Place) => {
    const total = place.averageMobilityRating + place.averageVisualRating + 
                  place.averageHearingRating + place.averageToiletRating
    return total / 4
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des lieux</h1>
          <p className="text-gray-600">{places.length} lieux au total</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un lieu
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un lieu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des lieux */}
      <div className="grid gap-4">
        {filteredPlaces.map((place) => (
          <Card key={place.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
                    <Badge className={getTypeColor(place.type)}>
                      {place.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 space-x-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{place.address}, {place.city}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Note moyenne: {getAverageRating(place).toFixed(1)}/5</span>
                    <span>{place.ratingsCount} évaluations</span>
                    <span>Créé le: {new Date(place.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="mt-2 flex space-x-4 text-xs">
                    <span>Mobilité: {place.averageMobilityRating.toFixed(1)}/5</span>
                    <span>Visuel: {place.averageVisualRating.toFixed(1)}/5</span>
                    <span>Auditif: {place.averageHearingRating.toFixed(1)}/5</span>
                    <span>Toilettes: {place.averageToiletRating.toFixed(1)}/5</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/admin/places/${place.id}/edit`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(place.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun lieu trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Aucun lieu ne correspond à votre recherche.' : 'Commencez par ajouter un lieu.'}
          </p>
        </div>
      )}
    </div>
  )
}
