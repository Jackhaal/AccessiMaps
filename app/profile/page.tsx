
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Star, MessageCircle, Shield, Settings } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

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
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mon Profil
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos informations et consultez votre activité
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations utilisateur */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom</label>
                  <p className="text-gray-900">{session.user?.name || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {session.user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Membre depuis</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {session.user?.isAdmin && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <p className="text-orange-600 flex items-center gap-2 font-medium">
                      <Shield className="w-4 h-4" />
                      Administrateur
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Administration - visible uniquement aux admins */}
            {session.user?.isAdmin && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Shield className="w-5 h-5" />
                    Administration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-600 mb-4">
                    En tant qu'administrateur, vous avez accès à l'interface de gestion de la plateforme.
                  </p>
                  <Link href="/admin">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Settings className="w-4 h-4 mr-2" />
                      Accéder à l'administration
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activité */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon Activité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Évaluations</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Commentaires</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/places">
                    <Button className="w-full sm:w-auto">
                      Rechercher des lieux
                    </Button>
                  </Link>
                  <Link href="/places/add">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Ajouter un lieu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
