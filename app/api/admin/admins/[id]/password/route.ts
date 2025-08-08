
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function PUT(
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
      select: { id: true, isAdmin: true, password: true }
    })

    if (!currentUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel et le nouveau mot de passe sont requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Récupérer l'admin cible
    const targetAdmin = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, isAdmin: true, password: true }
    })

    if (!targetAdmin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      )
    }

    if (!targetAdmin.isAdmin) {
      return NextResponse.json(
        { error: 'L\'utilisateur spécifié n\'est pas un administrateur' },
        { status: 400 }
      )
    }

    // Vérifier le mot de passe actuel
    // Si c'est le même admin qui modifie son propre mot de passe
    if (currentUser.id === params.id) {
      if (!currentUser.password || !await bcrypt.compare(currentPassword, currentUser.password)) {
        return NextResponse.json(
          { error: 'Mot de passe actuel incorrect' },
          { status: 401 }
        )
      }
    } else {
      // Si c'est un autre admin qui modifie, vérifier le mot de passe de l'admin actuel
      if (!currentUser.password || !await bcrypt.compare(currentPassword, currentUser.password)) {
        return NextResponse.json(
          { error: 'Votre mot de passe administrateur est incorrect' },
          { status: 401 }
        )
      }
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: params.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Mot de passe modifié avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la modification du mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
