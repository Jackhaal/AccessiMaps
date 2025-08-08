
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Accessibility, Menu, X, User, LogOut, Search, Plus, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function ClientHeader() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const loading = status === 'loading'

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Accessibility className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">AccessiMaps</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link 
              href="/places" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher</span>
            </Link>
            <Link 
              href="/places/add" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un lieu</span>
            </Link>
            {/* Lien administration - visible uniquement aux admins */}
            {session?.user?.isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors font-medium text-sm lg:text-base"
              >
                <Shield className="h-4 w-4" />
                <span>Administration</span>
              </Link>
            )}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {loading ? (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 max-w-48">
                    {session.user?.isAdmin ? (
                      <Shield className="h-4 w-4 text-orange-600 shrink-0" />
                    ) : (
                      <User className="h-4 w-4 shrink-0" />
                    )}
                    <span className={`truncate text-sm ${session.user?.isAdmin ? "text-orange-600 font-medium" : ""}`}>
                      {session.user?.name || session.user?.email}
                      {session.user?.isAdmin && <span className="text-xs ml-1">(Admin)</span>}
                    </span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="text-sm">Connexion</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-sm">Inscription</Button>
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <Card className="md:hidden absolute top-14 sm:top-16 left-4 right-4 border-2 bg-white shadow-lg z-50">
            <div className="p-4 space-y-4">
              <Link 
                href="/places" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 py-2"
                onClick={closeMenu}
              >
                <Search className="h-4 w-4" />
                <span>Rechercher</span>
              </Link>
              <Link 
                href="/places/add" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 py-2"
                onClick={closeMenu}
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un lieu</span>
              </Link>
              
              {/* Lien administration mobile - visible uniquement aux admins */}
              {session?.user?.isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 py-2 font-medium"
                  onClick={closeMenu}
                >
                  <Shield className="h-4 w-4" />
                  <span>Administration</span>
                </Link>
              )}
              
              <hr className="border-gray-200" />
              
              {session ? (
                <>
                  <Link 
                    href="/profile" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 py-2"
                    onClick={closeMenu}
                  >
                    {session.user?.isAdmin ? (
                      <Shield className="h-4 w-4 text-orange-600" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className={`truncate ${session.user?.isAdmin ? "text-orange-600 font-medium" : ""}`}>
                      {session.user?.name || session.user?.email}
                      {session.user?.isAdmin && <span className="text-xs ml-1">(Admin)</span>}
                    </span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut()
                      closeMenu()
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 py-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="block py-2 text-gray-600 hover:text-blue-600"
                    onClick={closeMenu}
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block py-2 text-blue-600 hover:text-blue-700 font-medium"
                    onClick={closeMenu}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </header>
  )
}
