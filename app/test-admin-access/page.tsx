
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAdminAccess() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const testAdminLogin = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('credentials', {
        email: 'admin@admin.com',
        password: 'password',
        redirect: false,
      })

      if (result?.error) {
        setMessage('❌ Échec de la connexion admin: ' + result.error)
      } else {
        setMessage('✅ Connexion admin réussie! Redirection vers /admin...')
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la connexion: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test d'Accès Admin</CardTitle>
          <CardDescription>
            Testez la connexion administrateur avec les identifiants prédéfinis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Identifiants Admin</h3>
            <p className="text-blue-700">Email: admin@admin.com</p>
            <p className="text-blue-700">Mot de passe: password</p>
          </div>
          
          <Button 
            onClick={testAdminLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Test en cours...' : 'Tester la Connexion Admin'}
          </Button>
          
          {message && (
            <div className={`p-3 rounded-lg ${message.includes('✅') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Ou testez manuellement :</p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin')}
              className="w-full"
            >
              Aller à /admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/auth/signin?callbackUrl=/admin')}
              className="w-full"
            >
              Page de Connexion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
