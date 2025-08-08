

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const place = await prisma.place.findUnique({
      where: {
        id
      }
    })

    if (!place) {
      return NextResponse.json({ error: 'Lieu non trouvé' }, { status: 404 })
    }

    return NextResponse.json(place)
  } catch (error) {
    console.error('Error fetching place:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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
      latitude,
      longitude
    } = data

    // Validation des champs requis
    if (!name || !address || !city || !postalCode || !type) {
      return NextResponse.json(
        { error: 'Les champs nom, adresse, ville, code postal et type sont obligatoires' },
        { status: 400 }
      )
    }

    const updatedPlace = await prisma.place.update({
      where: {
        id
      },
      data: {
        name,
        address,
        city,
        postalCode,
        type,
        description: description || null,
        website: website || null,
        phone: phone || null,
        latitude: latitude || null,
        longitude: longitude || null
      }
    })

    return NextResponse.json(updatedPlace)
  } catch (error) {
    console.error('Error updating place:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Supprimer le lieu (les ratings et comments seront supprimés automatiquement grâce à onDelete: Cascade)
    await prisma.place.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting place:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
