

export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        type: true,
        averageMobilityRating: true,
        averageVisualRating: true,
        averageHearingRating: true,
        averageToiletRating: true,
        ratingsCount: true,
        createdAt: true
      }
    })

    return NextResponse.json(places)
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
