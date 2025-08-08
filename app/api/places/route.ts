
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sortByDistance, filterByRadius } from '@/lib/distance'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const type = searchParams.get('type') || ''
    const minRating = searchParams.get('minRating') || ''
    const minToiletRating = searchParams.get('minToiletRating') || ''
    const city = searchParams.get('city') || ''
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const radius = searchParams.get('radius')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {}

    // Recherche textuelle
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }

    // Filtres
    if (type && type !== 'all') {
      where.type = type
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (minRating && minRating !== 'all') {
      where.averageRating = { gte: parseFloat(minRating) }
    }

    if (minToiletRating && minToiletRating !== 'all') {
      where.averageToiletRating = { gte: parseFloat(minToiletRating) }
    }

    let places = await prisma.place.findMany({
      where,
      include: {
        _count: {
          select: {
            ratings: true,
            comments: true
          }
        }
      },
      orderBy: [
        { averageMobilityRating: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    let total = places.length

    // Si géolocalisation fournie, trier par distance
    if (lat && lon) {
      const userLat = parseFloat(lat)
      const userLon = parseFloat(lon)
      const radiusKm = radius ? parseFloat(radius) : undefined

      if (!isNaN(userLat) && !isNaN(userLon)) {
        if (radiusKm) {
          // Filtrer par rayon si spécifié
          places = filterByRadius(places, userLat, userLon, radiusKm)
        } else {
          // Sinon juste trier par distance
          places = sortByDistance(places, userLat, userLon)
        }
        total = places.length
      }
    }

    // Pagination après tri/filtrage par distance
    const paginatedPlaces = places.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      places: paginatedPlaces,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      name,
      address,
      city,
      postalCode,
      type,
      description,
      website,
      phone,
      imageUrl,
      latitude,
      longitude
    } = data

    if (!name || !address || !city || !postalCode || !type) {
      return NextResponse.json(
        { error: 'Les champs requis sont manquants' },
        { status: 400 }
      )
    }

    const place = await prisma.place.create({
      data: {
        name,
        address,
        city,
        postalCode,
        type,
        description: description || null,
        website: website || null,
        phone: phone || null,
        imageUrl: imageUrl || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      }
    })

    return NextResponse.json(place, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
