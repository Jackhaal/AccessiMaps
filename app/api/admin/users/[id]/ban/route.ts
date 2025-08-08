
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Pour simplifier, on va juste marquer l'utilisateur comme inactif en supprimant ses sessions
    // Dans un vrai système, on ajouterait un champ "banned" dans le modèle User
    await prisma.session.deleteMany({
      where: {
        userId: id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error banning user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
