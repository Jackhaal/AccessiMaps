
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accessibility, Heart, Users, Target } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            À propos d'AccessiMaps
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre mission est de rendre les lieux publics plus accessibles pour tous, 
            en créant une communauté solidaire et informée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Notre Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Faciliter l'accès aux lieux publics pour les personnes en situation de handicap 
                en fournissant des informations fiables et détaillées sur l'accessibilité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Notre Communauté</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Une communauté bienveillante qui partage ses expériences pour aider 
                chacun à trouver les lieux qui lui correspondent.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="text-center">
          <CardHeader>
            <div className="bg-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-4">
              <Heart className="w-12 h-12 text-white mx-auto" />
            </div>
            <CardTitle className="text-2xl">Ensemble pour l'accessibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-lg">
              AccessiMaps est né de la conviction que chacun doit pouvoir accéder 
              aux lieux publics en toute autonomie et dignité. Grâce à votre participation, 
              nous construisons ensemble une France plus accessible.
            </p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
