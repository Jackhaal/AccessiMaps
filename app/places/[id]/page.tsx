
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PlaceDetail } from './components/place-detail'
import { prisma } from '@/lib/db'

interface PlacePageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return []
}

export const dynamic = 'force-dynamic'

async function getPlace(id: string) {
  try {
    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        comments: {
          where: {
            parentId: null // Seulement les commentaires principaux (pas les réponses)
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            },
            _count: {
              select: {
                replies: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            ratings: true,
            comments: true
          }
        }
      }
    })

    return place
  } catch (error) {
    console.error('Erreur lors de la récupération du lieu:', error)
    return null
  }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const place = await getPlace(params.id)

  if (!place) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PlaceDetail place={place} />
      <Footer />
    </div>
  )
}
