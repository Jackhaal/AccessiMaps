

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Récupérer l'évaluation avant de la supprimer pour mettre à jour les moyennes du lieu
    const rating = await prisma.rating.findUnique({
      where: { id },
      include: { place: true }
    })

    if (!rating) {
      return NextResponse.json({ error: 'Évaluation non trouvée' }, { status: 404 })
    }

    // Supprimer l'évaluation
    await prisma.rating.delete({
      where: { id }
    })

    // Recalculer les moyennes du lieu
    const updatedRatings = await prisma.rating.findMany({
      where: { placeId: rating.placeId }
    })

    if (updatedRatings.length > 0) {
      const averageMobilityRating = updatedRatings.reduce((sum: number, r: any) => sum + r.mobilityRating, 0) / updatedRatings.length
      const averageVisualRating = updatedRatings.reduce((sum: number, r: any) => sum + r.visualRating, 0) / updatedRatings.length
      const averageHearingRating = updatedRatings.reduce((sum: number, r: any) => sum + r.hearingRating, 0) / updatedRatings.length
      const averageToiletRating = updatedRatings.reduce((sum: number, r: any) => sum + r.toiletRating, 0) / updatedRatings.length

      await prisma.place.update({
        where: { id: rating.placeId },
        data: {
          averageMobilityRating,
          averageVisualRating,
          averageHearingRating,
          averageToiletRating,
          ratingsCount: updatedRatings.length
        }
      })
    } else {
      // Aucune évaluation restante
      await prisma.place.update({
        where: { id: rating.placeId },
        data: {
          averageMobilityRating: 0,
          averageVisualRating: 0,
          averageHearingRating: 0,
          averageToiletRating: 0,
          ratingsCount: 0
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting rating:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
