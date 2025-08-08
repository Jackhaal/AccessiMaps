
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
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    // Vérifier si l'utilisateur actuel est admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })

    if (!currentUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que l'utilisateur à promouvoir existe
    const userToPromote = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, isAdmin: true, email: true, name: true }
    })

    if (!userToPromote) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    if (userToPromote.isAdmin) {
      return NextResponse.json(
        { error: 'L\'utilisateur est déjà administrateur' },
        { status: 400 }
      )
    }

    // Promouvoir l'utilisateur en admin
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isAdmin: true },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erreur lors de la promotion de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
