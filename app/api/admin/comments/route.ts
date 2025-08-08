
import { NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminCheck = await verifyAdminAccess()
    
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: adminCheck.error }, { status: 403 })
    }

    // Récupérer tous les commentaires (parents et réponses)
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        place: {
          select: {
            name: true,
            city: true
          }
        },
        parent: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
