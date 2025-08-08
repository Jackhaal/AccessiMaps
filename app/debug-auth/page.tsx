
'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function DebugAuthPage() {
  const { data: session, status } = useSession()
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshSession = () => {
    setRefreshKey(prev => prev + 1)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">🔍 Debug Authentification</h1>
            <button
              onClick={refreshSession}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 Actualiser Session
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">📊 Status de session</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    status === 'authenticated' ? 'bg-green-100 text-green-800' :
                    status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Session existe:</span>
                  <span className="ml-2">{session ? '✅ Oui' : '❌ Non'}</span>
                </div>
                {session && (
                  <div className="flex items-center">
                    <span className="font-medium">User isAdmin:</span>
                    <span className="ml-2">
                      {(session.user as any)?.isAdmin ? '✅ true' : '❌ false/undefined'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Session complète */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">🎫 Session complète</h2>
              <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-64">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            {/* User object */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">👤 Objet User</h2>
              <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-64">
                {JSON.stringify(session?.user, null, 2)}
              </pre>
            </div>

            {/* Tests d'accès */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">🔐 Tests d'accès</h2>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Test 1: session?.user?.isAdmin</div>
                  <div className={`mt-1 ${(session?.user as any)?.isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    Résultat: {(session?.user as any)?.isAdmin ? '✅ true' : '❌ false/undefined'}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Test 2: Accès admin autorisé?</div>
                  <div className={`mt-1 ${status === 'authenticated' && (session?.user as any)?.isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    Résultat: {status === 'authenticated' && (session?.user as any)?.isAdmin ? 
                      '✅ ACCÈS AUTORISÉ' : 
                      '❌ ACCÈS REFUSÉ'}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Test 3: Redirection nécessaire?</div>
                  <div className={`mt-1 ${
                    status === 'unauthenticated' ? 'text-yellow-600' :
                    status === 'authenticated' && !(session?.user as any)?.isAdmin ? 'text-red-600' :
                    'text-green-600'
                  }`}>
                    Résultat: {
                      status === 'unauthenticated' ? '⚠️ Redirection vers /auth/signin' :
                      status === 'authenticated' && !(session?.user as any)?.isAdmin ? '❌ Redirection vers /' :
                      '✅ Pas de redirection'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex space-x-4">
            <a
              href="/auth/signin"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              🔐 Page de connexion
            </a>
            <a
              href="/admin"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🛡️ Tester accès admin
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🏠 Accueil
            </a>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions de test</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Connectez-vous avec admin@admin.com / password</li>
              <li>Revenez sur cette page et vérifiez les informations de session</li>
              <li>Testez l'accès à /admin</li>
              <li>Si isAdmin n'est pas true, il y a un problème avec l'authentification</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
