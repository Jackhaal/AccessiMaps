

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddressAutocomplete } from '@/components/ui/address-autocomplete'
import { ImageUpload } from '@/components/ui/image-upload'
import { Plus, Building, Phone, Globe, CheckCircle, Upload } from 'lucide-react'
import Link from 'next/link'

const placeTypes = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CINEMA', label: 'Cinéma' },
  { value: 'PARC', label: 'Parc' },
  { value: 'MUSEE', label: 'Musée' },
  { value: 'BAR', label: 'Bar/Café' },
  { value: 'TOILETTES_PUBLIQUES', label: 'Toilettes publiques' },
  { value: 'HOPITAL', label: 'Hôpital' },
  { value: 'ECOLE', label: 'École' },
  { value: 'UNIVERSITE', label: 'Université' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'MAGASIN', label: 'Magasin' },
  { value: 'BUREAU', label: 'Bureau' },
  { value: 'AUTRE', label: 'Autre' }
]

interface SelectedAddress {
  fullAddress: string
  name: string
  city: string
  postalCode: string
  latitude: number
  longitude: number
}

export default function AddPlacePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [addressSelected, setAddressSelected] = useState(false)
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('upload')

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    latitude: null as number | null,
    longitude: null as number | null,
    type: '',
    description: '',
    website: '',
    phone: '',
    imageUrl: ''
  })

  // Redirection si non connecté
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour ajouter un lieu
          </p>
          <Link href="/auth/signin">
            <Button>Se connecter</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressSelect = (address: SelectedAddress) => {
    setFormData(prev => ({
      ...prev,
      address: address.fullAddress,
      city: address.city,
      postalCode: address.postalCode,
      latitude: address.latitude,
      longitude: address.longitude
    }))
    setAddressSelected(true)
    setError('') // Clear any address-related errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!formData.name || !formData.address || !formData.city || !formData.postalCode || !formData.type) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
      }

      if (!addressSelected) {
        setError('Veuillez sélectionner une adresse dans la liste proposée')
        return
      }

      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la création du lieu')
        return
      }

      router.push(`/places/${data.id}`)
    } catch (error) {
      setError('Erreur lors de la création du lieu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ajouter un nouveau lieu
          </h1>
          <p className="text-lg text-gray-600">
            Partagez un lieu avec la communauté pour améliorer l'accessibilité
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Informations du lieu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du lieu */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom du lieu *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Restaurant Le Central"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type de lieu */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Type de lieu *
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
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
              </div>

              {/* Adresse avec autocomplétion */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Adresse *
                  {addressSelected && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </label>
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="Recherchez une adresse française..."
                  initialValue={formData.address}
                />
                
                {addressSelected && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <p className="text-green-700 text-sm font-medium">
                        Adresse validée
                      </p>
                    </div>
                    <div className="mt-1 text-sm text-green-600">
                      <p><strong>Adresse :</strong> {formData.address}</p>
                      <p><strong>Ville :</strong> {formData.city}</p>
                      <p><strong>Code postal :</strong> {formData.postalCode}</p>
                      {formData.latitude && formData.longitude && (
                        <p><strong>Coordonnées :</strong> {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description (optionnel)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Décrivez brièvement le lieu et ses spécificités d'accessibilité..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site web */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Site web (optionnel)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="url"
                      placeholder="https://www.exemple.com"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Téléphone (optionnel)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="tel"
                      placeholder="01 23 45 67 89"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Image du lieu */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Image du lieu (optionnel)
                </label>
                
                {/* Sélecteur de mode */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={imageUploadMode === 'upload' ? 'default' : 'outline'}
                    onClick={() => setImageUploadMode('upload')}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Uploader une image
                  </Button>
                  <Button
                    type="button"
                    variant={imageUploadMode === 'url' ? 'default' : 'outline'}
                    onClick={() => setImageUploadMode('url')}
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Utiliser une URL
                  </Button>
                </div>

                {/* Mode upload */}
                {imageUploadMode === 'upload' && (
                  <ImageUpload
                    onImageUpload={(imageUrl) => handleChange('imageUrl', imageUrl)}
                    currentImageUrl={formData.imageUrl}
                  />
                )}

                {/* Mode URL */}
                {imageUploadMode === 'url' && (
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://exemple.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => handleChange('imageUrl', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Entrez l'URL d'une image pour illustrer le lieu
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <Link href="/places">
                  <Button variant="outline">Annuler</Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading || !addressSelected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Création...' : 'Créer le lieu'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information sur l'API Adresse */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-blue-800">
              Adresses certifiées
            </h3>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Ce formulaire utilise l'API Adresse officielle du gouvernement français pour garantir 
            la validité des adresses et améliorer la géolocalisation des lieux d'accessibilité.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
