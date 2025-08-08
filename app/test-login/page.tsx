
'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TestLoginPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const testLogin = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🔄 Tentative de connexion avec admin@admin.com / password')
      
      const result = await signIn('credentials', {
        email: 'admin@admin.com',
        password: 'password',
        redirect: false,
      })

      console.log('📊 Résultat signIn:', result)

      if (result?.error) {
        setError(`❌ Erreur de connexion: ${result.error}`)
        setResult('❌ ÉCHEC DE CONNEXION')
      } else if (result?.ok) {
        setResult('✅ CONNEXION RÉUSSIE ! Redirection vers /admin...')
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        setError('❌ Résultat inattendu')
        setResult('❌ RÉSULTAT INCONNU')
      }
    } catch (error) {
      console.error('❌ Erreur:', error)
      setError(`❌ Exception: ${error}`)
      setResult('❌ ERREUR TECHNIQUE')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    const { signOut } = await import('next-auth/react')
    await signOut({ redirect: false })
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🧪 Test de Connexion Automatique</h1>

          {/* Status actuel */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">📊 Status Actuel</h2>
            <div className="space-y-1 text-blue-800">
              <div>Status: <span className={`font-bold ${
                status === 'authenticated' ? 'text-green-600' :
                status === 'loading' ? 'text-yellow-600' :
                'text-red-600'
              }`}>{status}</span></div>
              <div>Utilisateur: {session?.user?.email || 'Aucun'}</div>
              <div>Admin: {(session?.user as any)?.isAdmin ? '✅ Oui' : '❌ Non'}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {status !== 'authenticated' && (
              <div>
                <h3 className="font-semibold mb-2">🔐 Test de Connexion</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Identifiants utilisés :</strong>
                  </p>
                  <p className="font-mono text-sm">
                    📧 admin@admin.com<br/>
                    🔑 password
                  </p>
                </div>
                <button
                  onClick={testLogin}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 Connexion en cours...' : '🚀 Tester la Connexion Admin'}
                </button>
              </div>
            )}

            {status === 'authenticated' && (
              <div>
                <h3 className="font-semibold mb-2 text-green-600">✅ Connecté avec succès!</h3>
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => router.push('/admin')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
                  >
                    🛡️ Aller au Dashboard Admin
                  </button>
                  <button
                    onClick={() => router.push('/debug-auth')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-2"
                  >
                    🔍 Voir les Détails de Session
                  </button>
                  <button
                    onClick={logout}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    🚪 Se Déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Résultat */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.includes('✅') ? 'bg-green-50 border border-green-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">📋 Résultat</h3>
              <p className={result.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                {result}
              </p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold mb-2 text-red-900">❌ Erreur</h3>
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Liens utiles */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-4">🔗 Liens Utiles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <a
                href="/auth/signin"
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-center text-sm"
              >
                🔐 Page Connexion
              </a>
              <a
                href="/debug-auth"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-center text-sm"
              >
                🔍 Debug Auth
              </a>
              <a
                href="/admin"
                className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-center text-sm"
              >
                🛡️ Dashboard Admin
              </a>
              <a
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center text-sm"
              >
                🏠 Accueil
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Instructions</h3>
            <ol className="list-decimal list-inside text-yellow-800 space-y-1 text-sm">
              <li>Cliquez sur "Tester la Connexion Admin" ci-dessus</li>
              <li>Si la connexion réussit, vous verrez "✅ CONNEXION RÉUSSIE !"</li>
              <li>Vous serez automatiquement redirigé vers /admin</li>
              <li>Si échec, vérifiez les messages d'erreur affichés</li>
              <li>Cette page utilise exactement les mêmes identifiants que la page de connexion manuelle</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
