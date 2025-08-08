
import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PlacesSearch } from './components/places-search'

export default function PlacesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Rechercher des lieux accessibles
              </h1>
              <p className="text-lg text-gray-600">
                Découvrez les lieux les mieux notés pour leur accessibilité
              </p>
            </div>

          </div>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="h-32 bg-white rounded-lg border animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-lg border animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <PlacesSearch />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}
