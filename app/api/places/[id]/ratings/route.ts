
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { mobilityRating, visualRating, hearingRating, toiletRating, parkingRating, guideDogRating } = data

    if (!mobilityRating || !visualRating || !hearingRating || !toiletRating || !parkingRating || !guideDogRating) {
      return NextResponse.json(
        { error: 'Toutes les notes sont requises' },
        { status: 400 }
      )
    }

    if (mobilityRating < 1 || mobilityRating > 5 || 
        visualRating < 1 || visualRating > 5 || 
        hearingRating < 1 || hearingRating > 5 || 
        toiletRating < 1 || toiletRating > 5 ||
        parkingRating < 1 || parkingRating > 5 ||
        guideDogRating < 1 || guideDogRating > 5) {
      return NextResponse.json(
        { error: 'Les notes doivent être entre 1 et 5' },
        { status: 400 }
      )
    }

    // Vérifier si le lieu existe
    const place = await prisma.place.findUnique({
      where: { id: params.id }
    })

    if (!place) {
      return NextResponse.json(
        { error: 'Lieu non trouvé' },
        { status: 404 }
      )
    }

    // Upsert la note (créer ou mettre à jour)
    const newRating = await prisma.rating.upsert({
      where: {
        userId_placeId: {
          userId: session.user.id,
          placeId: params.id
        }
      },
      update: {
        mobilityRating: parseInt(mobilityRating),
        visualRating: parseInt(visualRating),
        hearingRating: parseInt(hearingRating),
        toiletRating: parseInt(toiletRating),
        parkingRating: parseInt(parkingRating),
        guideDogRating: parseInt(guideDogRating)
      },
      create: {
        userId: session.user.id,
        placeId: params.id,
        mobilityRating: parseInt(mobilityRating),
        visualRating: parseInt(visualRating),
        hearingRating: parseInt(hearingRating),
        toiletRating: parseInt(toiletRating),
        parkingRating: parseInt(parkingRating),
        guideDogRating: parseInt(guideDogRating)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Recalculer les moyennes
    const ratings = await prisma.rating.findMany({
      where: { placeId: params.id }
    })

    const averageMobilityRating = ratings.reduce((sum, r) => sum + r.mobilityRating, 0) / ratings.length
    const averageVisualRating = ratings.reduce((sum, r) => sum + r.visualRating, 0) / ratings.length
    const averageHearingRating = ratings.reduce((sum, r) => sum + r.hearingRating, 0) / ratings.length
    const averageToiletRating = ratings.reduce((sum, r) => sum + r.toiletRating, 0) / ratings.length
    const averageParkingRating = ratings.reduce((sum, r) => sum + r.parkingRating, 0) / ratings.length
    const averageGuideDogRating = ratings.reduce((sum, r) => sum + r.guideDogRating, 0) / ratings.length

    await prisma.place.update({
      where: { id: params.id },
      data: {
        averageMobilityRating,
        averageVisualRating,
        averageHearingRating,
        averageToiletRating,
        averageParkingRating,
        averageGuideDogRating,
        ratingsCount: ratings.length
      }
    })

    return NextResponse.json(newRating, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
