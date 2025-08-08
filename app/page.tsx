
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { HomePageClient } from './components/home-page-client'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ClientHeader />
      <HomePageClient />
      <Footer />
    </div>
  )
}
