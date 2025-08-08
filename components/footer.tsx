
import Link from 'next/link'
import { Accessibility, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo et description */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Accessibility className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">AccessiMaps</span>
              <p className="text-sm text-gray-600">L'accessibilité pour tous</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/places" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Rechercher
            </Link>
            <Link 
              href="/places/add" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Ajouter un lieu
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              À propos
            </Link>
          </nav>

          {/* Copyright */}
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Fait avec</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>pour l'accessibilité</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
