
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2, Upload, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/ui/image-upload'

interface Place {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  type: string
  description: string | null
  website: string | null
  phone: string | null
  imageUrl: string | null
  latitude: number | null
  longitude: number | null
}

const PLACE_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CINEMA', label: 'Cinéma' },
  { value: 'PARC', label: 'Parc' },
  { value: 'MUSEE', label: 'Musée' },
  { value: 'BAR', label: 'Bar' },
  { value: 'TOILETTES_PUBLIQUES', label: 'Toilettes publiques' },
  { value: 'HOPITAL', label: 'Hôpital' },
  { value: 'ECOLE', label: 'École' },
  { value: 'UNIVERSITE', label: 'Université' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'MAGASIN', label: 'Magasin' },
  { value: 'BUREAU', label: 'Bureau' },
  { value: 'AUTRE', label: 'Autre' },
]

export default function EditPlace({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('upload')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    type: '',
    description: '',
    website: '',
    phone: '',
    imageUrl: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPlace()
    }
  }, [mounted, id])

  const fetchPlace = async () => {
    try {
      const response = await fetch(`/api/admin/places/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPlace(data)
        setFormData({
          name: data.name || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          type: data.type || '',
          description: data.description || '',
          website: data.website || '',
          phone: data.phone || '',
          imageUrl: data.imageUrl || '',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || ''
        })
      } else {
        toast.error('Lieu non trouvé')
        router.push('/admin/places')
      }
    } catch (error) {
      console.error('Error fetching place:', error)
      toast.error('Erreur lors du chargement du lieu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }

      const response = await fetch(`/api/admin/places/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success('Lieu modifié avec succès')
        router.push('/admin/places')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Error updating place:', error)
      toast.error('Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lieu non trouvé</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/places')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier le lieu</h1>
          <p className="text-gray-600">{place.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du lieu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du lieu *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de lieu *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLACE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>

            {/* Image du lieu */}
            <div className="space-y-4">
              <Label>Image du lieu (optionnel)</Label>
              
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
                  onImageUpload={(imageUrl) => handleInputChange('imageUrl', imageUrl)}
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
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Entrez l'URL d'une image pour illustrer le lieu
                  </p>
                </div>
              )}
            </div>

            {/* Coordonnées géographiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="ex: 48.8566"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="ex: 2.3522"
                />
              </div>
            </div>

            {/* Informations complémentaires */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Description du lieu..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="01 23 45 67 89"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/places')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
