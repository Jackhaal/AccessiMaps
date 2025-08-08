

'use client'

import { Button } from '@/components/ui/button'
import { Navigation, MapPin } from 'lucide-react'
import { useState } from 'react'

interface NavigateButtonProps {
  place: {
    name: string
    latitude?: number | null
    longitude?: number | null
    address: string
    city: string
  }
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function NavigateButton({ place, variant = 'default', size = 'default', className }: NavigateButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleNavigation = async () => {
    setIsLoading(true)
    
    try {
      let destination = ''
      
      // Si on a les coordonnées exactes, on les utilise
      if (place.latitude != null && place.longitude != null) {
        destination = `${place.latitude},${place.longitude}`
      } else {
        // Sinon, on utilise l'adresse
        destination = encodeURIComponent(`${place.address}, ${place.city}`)
      }

      // Détection du navigateur/appareil pour choisir l'app appropriée
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)
      
      let mapUrl = ''
      
      if (isIOS) {
        // Pour iOS, utiliser Apple Maps si disponible, sinon Google Maps
        if (place.latitude != null && place.longitude != null) {
          mapUrl = `maps://maps.apple.com/?daddr=${destination}&dirflg=d`
        } else {
          mapUrl = `maps://maps.apple.com/?daddr=${destination}`
        }
        
        // Fallback vers Google Maps si Apple Maps n'est pas disponible
        const fallbackUrl = `https://maps.google.com/maps?daddr=${destination}&amp;ll=`
        
        try {
          window.open(mapUrl, '_system')
          // Si ça ne marche pas, utiliser le fallback après un délai
          setTimeout(() => {
            window.open(fallbackUrl, '_blank')
          }, 500)
        } catch (error) {
          window.open(fallbackUrl, '_blank')
        }
        
      } else if (isAndroid) {
        // Pour Android, utiliser Google Maps
        if (place.latitude != null && place.longitude != null) {
          mapUrl = `google.navigation:q=${destination}`
        } else {
          mapUrl = `geo:0,0?q=${destination}`
        }
        
        const fallbackUrl = `https://maps.google.com/maps?daddr=${destination}`
        
        try {
          window.open(mapUrl, '_system')
          // Fallback après un délai
          setTimeout(() => {
            window.open(fallbackUrl, '_blank')
          }, 500)
        } catch (error) {
          window.open(fallbackUrl, '_blank')
        }
        
      } else {
        // Pour desktop, ouvrir Google Maps dans un nouvel onglet
        mapUrl = `https://maps.google.com/maps?daddr=${destination}&dirflg=d`
        window.open(mapUrl, '_blank')
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la navigation:', error)
      // Fallback final vers Google Maps web
      const fallbackUrl = place.latitude != null && place.longitude != null 
        ? `https://maps.google.com/maps?daddr=${place.latitude},${place.longitude}`
        : `https://maps.google.com/maps?daddr=${encodeURIComponent(`${place.address}, ${place.city}`)}`
      window.open(fallbackUrl, '_blank')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleNavigation}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Ouverture...
        </>
      ) : (
        <>
          <Navigation className="w-4 h-4" />
          Y aller
        </>
      )}
    </Button>
  )
}
