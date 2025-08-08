
'use client'

import { SearchBar } from '@/components/ui/search-bar'
import { NearbyPlaces } from '@/components/ui/nearby-places'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accessibility, Eye, Ear, Users, MapPin, Plus } from 'lucide-react'
import Link from 'next/link'

export function HomePageClient() {
  const handleSearch = (query: string, filters: any) => {
    // La recherche sera redirigée vers /places avec les paramètres
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (filters.type !== 'all') params.append('type', filters.type)
    if (filters.minRating !== 'all') params.append('minRating', filters.minRating)
    if (filters.minToiletRating !== 'all') params.append('minToiletRating', filters.minToiletRating)
    if (filters.city) params.append('city', filters.city)
    
    window.location.href = `/places?${params.toString()}`
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-8 px-4 sm:py-12 md:py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            {/* Titre principal optimisé pour mobile */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Trouvez des lieux{' '}
              <span className="text-blue-600 block xs:inline">accessibles</span>{' '}
              près de vous
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
              Découvrez et évaluez l'accessibilité des restaurants, cinémas, parcs et autres lieux publics partout en France
            </p>
            
            {/* Barre de recherche principale */}
            <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Boutons d'action optimisés pour mobile */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center max-w-md mx-auto xs:max-w-none">
              <Link href="/places" className="w-full xs:w-auto">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 w-full xs:w-auto">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explorer les lieux
                </Button>
              </Link>
              <Link href="/places/add" className="w-full xs:w-auto">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 w-full xs:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter un lieu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 px-4 sm:py-12 md:py-16 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Une plateforme complète pour l'accessibilité
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Nous couvrons tous les aspects de l'accessibilité pour vous aider à trouver les lieux qui correspondent à vos besoins
            </p>
          </div>

          {/* Grille optimisée pour tous les écrans */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <Accessibility className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Mobilité réduite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Accès en fauteuil roulant, rampes, ascenseurs et espaces adaptés
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <Eye className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-lg">Déficience visuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Guidage podotactile, signalétique braille et audio-description
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <Ear className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Déficience auditive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Boucles magnétiques, interprétation LSF et signalétique visuelle
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow xs:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                  <Users className="w-10 h-10 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Toilettes accessibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Toilettes PMR avec barres d'appui et espaces de manœuvre adaptés
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nearby Places Section */}
      <section className="py-8 px-4 sm:py-12 md:py-16 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Découvrez les lieux accessibles près de vous
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Utilisez votre géolocalisation pour trouver instantanément les lieux les mieux notés dans votre zone
            </p>
          </div>
          
          <NearbyPlaces maxResults={6} />
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-8 px-4 sm:py-12 md:py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Trois étapes simples pour améliorer l'accessibilité ensemble
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recherchez</h3>
              <p className="text-gray-600 text-sm sm:text-base px-2">
                Trouvez les lieux qui vous intéressent grâce à notre moteur de recherche avancé
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Évaluez</h3>
              <p className="text-gray-600 text-sm sm:text-base px-2">
                Consultez les notes et commentaires d'autres utilisateurs sur l'accessibilité
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Partagez</h3>
              <p className="text-gray-600 text-sm sm:text-base px-2">
                Ajoutez vos propres évaluations pour aider la communauté
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 px-4 sm:py-12 md:py-16 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Rejoignez la communauté AccessiMaps
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-2">
            Ensemble, créons une France plus accessible pour tous
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center max-w-md mx-auto xs:max-w-none">
            <Link href="/auth/signup" className="w-full xs:w-auto">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 w-full xs:w-auto">
                Créer un compte gratuitement
              </Button>
            </Link>
            <Link href="/places" className="w-full xs:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 w-full xs:w-auto"
              >
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
