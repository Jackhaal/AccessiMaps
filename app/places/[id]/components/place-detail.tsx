
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { StarRating } from '@/components/ui/star-rating'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { NavigateButton } from '@/components/ui/navigate-button'
import { CommentsSection } from './comments-section'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Calendar, 
  Accessibility, 
  Users, 
  MessageCircle,
  Star,
  Eye,
  Ear,
  Share,
  ArrowLeft,
  Car,
  Heart
} from 'lucide-react'

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

interface PlaceDetailProps {
  place: any // Type complet depuis Prisma
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  const { data: session } = useSession()
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // État pour le formulaire de notation
  const [mobilityRating, setMobilityRating] = useState(0)
  const [visualRating, setVisualRating] = useState(0)
  const [hearingRating, setHearingRating] = useState(0)
  const [toiletRating, setToiletRating] = useState(0)
  const [parkingRating, setParkingRating] = useState(0)
  const [guideDogRating, setGuideDogRating] = useState(0)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: `Découvrez ${place.name} sur AccessiMaps`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Partage annulé')
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      await navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  const submitRating = async () => {
    if (!session || !mobilityRating || !visualRating || !hearingRating || !toiletRating || !parkingRating || !guideDogRating) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/places/${place.id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobilityRating, 
          visualRating, 
          hearingRating, 
          toiletRating,
          parkingRating,
          guideDogRating
        }),
      })

      if (response.ok) {
        window.location.reload() // Recharger pour voir les nouvelles données
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }



  const getAccessibilityColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800 border-green-200'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (rating >= 2) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const userRating = place.ratings?.find((r: any) => r.user.id === session?.user?.id)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/places" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la recherche
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header du lieu */}
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{place.name}</h1>
                    <Badge variant="outline" className="text-sm">
                      {placeTypeLabels[place.type as keyof typeof placeTypeLabels]}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{place.address}, {place.city} {place.postalCode}</span>
                  </div>

                  {place.description && (
                    <p className="text-gray-700 mb-4">{place.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {place.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{place.phone}</span>
                      </div>
                    )}
                    {place.website && (
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        <span>Site web</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <NavigateButton 
                    place={{
                      name: place.name,
                      latitude: place.latitude,
                      longitude: place.longitude,
                      address: place.address,
                      city: place.city
                    }}
                    variant="default"
                    size="default"
                  />
                  <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Image du lieu */}
              {place.imageUrl && (
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={place.imageUrl}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Notes d'accessibilité */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Accessibility className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Mobilité réduite</h3>
                      <StarRating rating={place.averageMobilityRating} readOnly size="sm" />
                    </div>
                  </div>
                  <Badge className={`${getAccessibilityColor(place.averageMobilityRating)}`}>
                    {place.averageMobilityRating.toFixed(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Déficience visuelle</h3>
                      <StarRating rating={place.averageVisualRating} readOnly size="sm" />
                    </div>
                  </div>
                  <Badge className={`${getAccessibilityColor(place.averageVisualRating)}`}>
                    {place.averageVisualRating.toFixed(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Ear className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Déficience auditive</h3>
                      <StarRating rating={place.averageHearingRating} readOnly size="sm" />
                    </div>
                  </div>
                  <Badge className={`${getAccessibilityColor(place.averageHearingRating)}`}>
                    {place.averageHearingRating.toFixed(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Toilettes accessibles</h3>
                      <StarRating rating={place.averageToiletRating} readOnly size="sm" />
                    </div>
                  </div>
                  <Badge className={`${getAccessibilityColor(place.averageToiletRating)}`}>
                    {place.averageToiletRating.toFixed(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Car className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Parking accessible</h3>
                      <StarRating rating={place.averageParkingRating} readOnly size="sm" />
                    </div>
                  </div>
                  <Badge className={`${getAccessibilityColor(place.averageParkingRating)}`}>
                    {place.averageParkingRating.toFixed(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Chiens guides acceptés</h3>
                      <StarRating rating={place.averageGuideDogRating} readOnly size="sm" />
                    </div>
                  </div>
                  <Badge className={`${getAccessibilityColor(place.averageGuideDogRating)}`}>
                    {place.averageGuideDogRating.toFixed(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
                <span>{place.ratingsCount} évaluation{place.ratingsCount > 1 ? 's' : ''}</span>
                <span>{place._count.comments} commentaire{place._count.comments > 1 ? 's' : ''}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions utilisateur */}
          {session && (
            <div className="flex gap-4">
              <Button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="flex items-center gap-2"
                variant={userRating ? "outline" : "default"}
              >
                <Star className="w-4 h-4" />
                {userRating ? 'Modifier ma note' : 'Noter ce lieu'}
              </Button>
            </div>
          )}

          {/* Formulaire de notation */}
          {showRatingForm && session && (
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-lg">Évaluer l'accessibilité</CardTitle>
                <p className="text-sm text-gray-600">Notez chaque aspect de l'accessibilité de 1 à 5 étoiles</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Accessibility className="w-4 h-4 text-blue-600" />
                      Mobilité réduite
                    </label>
                    <StarRating
                      rating={mobilityRating}
                      onRatingChange={setMobilityRating}
                      size="lg"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      Déficience visuelle
                    </label>
                    <StarRating
                      rating={visualRating}
                      onRatingChange={setVisualRating}
                      size="lg"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Ear className="w-4 h-4 text-orange-600" />
                      Déficience auditive
                    </label>
                    <StarRating
                      rating={hearingRating}
                      onRatingChange={setHearingRating}
                      size="lg"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      Accessibilité des toilettes
                    </label>
                    <StarRating
                      rating={toiletRating}
                      onRatingChange={setToiletRating}
                      size="lg"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Car className="w-4 h-4 text-indigo-600" />
                      Parking accessible
                    </label>
                    <StarRating
                      rating={parkingRating}
                      onRatingChange={setParkingRating}
                      size="lg"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      Chiens guides acceptés
                    </label>
                    <StarRating
                      rating={guideDogRating}
                      onRatingChange={setGuideDogRating}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowRatingForm(false)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={submitRating}
                    disabled={!mobilityRating || !visualRating || !hearingRating || !toiletRating || !parkingRating || !guideDogRating || isSubmitting}
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}


        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Évaluations</span>
                <span className="font-semibold">{place.ratingsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Commentaires</span>
                <span className="font-semibold">{place._count.comments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ajouté le</span>
                <span className="text-sm text-gray-500">
                  {new Date(place.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Section des commentaires */}
      <div className="mt-12">
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commentaires et expériences</h2>
          <CommentsSection placeId={place.id} comments={place.comments} />
        </div>
      </div>
    </main>
  )
}
