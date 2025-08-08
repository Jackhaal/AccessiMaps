
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Dans un vrai système, on removerait le flag "banned" de l'utilisateur
    // Pour l'instant, on ne fait rien de spécial car on ne stocke pas le statut banni

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unbanning user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
