
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      content,
      parentId,
      imageUrl,
      accessibilityDetails,
      wheelchairAccess,
      visualImpairment,
      hearingImpairment,
      mobilityIssues,
      parkingAccess,
      guideDogAccepted
    } = data

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Le contenu du commentaire est requis' },
        { status: 400 }
      )
    }

    // Vérifier si le lieu existe
    const place = await prisma.place.findUnique({
      where: { id: params.id }
    })

    if (!place) {
      return NextResponse.json(
        { error: 'Lieu non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le commentaire parent existe (si c'est une réponse)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      })
      
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Commentaire parent non trouvé' },
          { status: 404 }
        )
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        placeId: params.id,
        parentId: parentId || null,
        content: content.trim(),
        imageUrl: imageUrl || null,
        accessibilityDetails: accessibilityDetails?.trim() || null,
        wheelchairAccess: wheelchairAccess || null,
        visualImpairment: visualImpairment || null,
        hearingImpairment: hearingImpairment || null,
        mobilityIssues: mobilityIssues || null,
        parkingAccess: parkingAccess || null,
        guideDogAccepted: guideDogAccepted || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
