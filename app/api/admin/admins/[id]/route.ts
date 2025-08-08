
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function DELETE(
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
      select: { id: true, isAdmin: true }
    })

    if (!currentUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Empêcher la suppression de soi-même
    if (currentUser.id === params.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      )
    }

    // Vérifier qu'il restera au moins un admin
    const adminCount = await prisma.user.count({
      where: { isAdmin: true }
    })

    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Il doit y avoir au moins un administrateur' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur à supprimer existe et est admin
    const adminToDelete = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, isAdmin: true }
    })

    if (!adminToDelete) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      )
    }

    if (!adminToDelete.isAdmin) {
      return NextResponse.json(
        { error: 'L\'utilisateur spécifié n\'est pas un administrateur' },
        { status: 400 }
      )
    }

    // Supprimer l'admin
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'admin:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
