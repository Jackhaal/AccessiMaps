

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await verifyAdminAccess()
    
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: adminCheck.error }, { status: 403 })
    }

    const commentId = params.id

    if (!commentId) {
      return NextResponse.json({ error: 'ID du commentaire requis' }, { status: 400 })
    }

    // Vérifier si le commentaire existe
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        replies: true
      }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Commentaire non trouvé' }, { status: 404 })
    }

    // Supprimer le commentaire (les réponses seront supprimées en cascade grâce au schema)
    await prisma.comment.delete({
      where: { id: commentId }
    })

    return NextResponse.json({ 
      message: 'Commentaire supprimé avec succès',
      deletedReplies: comment.replies.length
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

