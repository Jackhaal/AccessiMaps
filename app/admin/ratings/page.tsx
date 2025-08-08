
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Search, Star, MapPin, User } from 'lucide-react'
import { toast } from 'sonner'

interface Rating {
  id: string
  mobilityRating: number
  visualRating: number
  hearingRating: number
  toiletRating: number
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  place: {
    name: string
    city: string
  }
}

export default function RatingsAdmin() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([])

  useEffect(() => {
    fetchRatings()
  }, [])

  useEffect(() => {
    const filtered = ratings.filter(rating =>
      rating.place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.place.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRatings(filtered)
  }, [ratings, searchTerm])

  const fetchRatings = async () => {
    try {
      const response = await fetch('/api/admin/ratings')
      if (response.ok) {
        const data = await response.json()
        setRatings(data)
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
      toast.error('Erreur lors du chargement des évaluations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (ratingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) return

    try {
      const response = await fetch(`/api/admin/ratings/${ratingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRatings(ratings.filter(rating => rating.id !== ratingId))
        toast.success('Evaluation supprimée avec succès')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting rating:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getAverageRating = (rating: Rating) => {
    return (rating.mobilityRating + rating.visualRating + rating.hearingRating + rating.toiletRating) / 4
  }

  const getRatingColor = (score: number) => {
    if (score >= 4) return 'text-green-600'
    if (score >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des évaluations</h1>
          <p className="text-gray-600">{ratings.length} évaluations au total</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher une évaluation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des évaluations */}
      <div className="grid gap-4">
        {filteredRatings.map((rating) => (
          <Card key={rating.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rating.place.name}</h3>
                    <Badge className={`${getRatingColor(getAverageRating(rating))} bg-transparent border`}>
                      <Star className="h-3 w-3 mr-1" />
                      {getAverageRating(rating).toFixed(1)}/5
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{rating.place.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{rating.user.name || rating.user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Mobilité</span>
                      <span className={`font-medium ${getRatingColor(rating.mobilityRating)}`}>
                        {rating.mobilityRating}/5
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Visuel</span>
                      <span className={`font-medium ${getRatingColor(rating.visualRating)}`}>
                        {rating.visualRating}/5
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Auditif</span>
                      <span className={`font-medium ${getRatingColor(rating.hearingRating)}`}>
                        {rating.hearingRating}/5
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Toilettes</span>
                      <span className={`font-medium ${getRatingColor(rating.toiletRating)}`}>
                        {rating.toiletRating}/5
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-700">
                        {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDelete(rating.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRatings.length === 0 && (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune évaluation trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Aucune évaluation ne correspond à votre recherche.' : 'Aucune évaluation disponible.'}
          </p>
        </div>
      )}
    </div>
  )
}
