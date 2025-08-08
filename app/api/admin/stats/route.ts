

export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Récupérer les statistiques principales
    const [totalUsers, totalPlaces, totalRatings, totalComments] = await Promise.all([
      prisma.user.count(),
      prisma.place.count(),
      prisma.rating.count(),
      prisma.comment.count(),
    ])

    // Récupérer l'activité récente
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    const recentPlaces = await prisma.place.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        city: true,
        createdAt: true
      }
    })

    const recentRatings = await prisma.rating.findMany({
      take: 2,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        place: {
          select: {
            name: true
          }
        }
      }
    })

    // Construire l'activité récente
    const recentActivity = [
      ...recentUsers.map((user: any) => ({
        id: user.id,
        type: 'user' as const,
        description: `Nouvel utilisateur: ${user.name || user.email}`,
        timestamp: user.createdAt.toISOString()
      })),
      ...recentPlaces.map((place: any) => ({
        id: place.id,
        type: 'place' as const,
        description: `Nouveau lieu: ${place.name} à ${place.city}`,
        timestamp: place.createdAt.toISOString()
      })),
      ...recentRatings.map((rating: any) => ({
        id: rating.id,
        type: 'rating' as const,
        description: `${rating.user.name || rating.user.email} a évalué ${rating.place.name}`,
        timestamp: rating.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    return NextResponse.json({
      totalUsers,
      totalPlaces,
      totalRatings,
      totalComments,
      recentActivity
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
