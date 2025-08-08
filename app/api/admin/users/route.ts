

export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false // Ne récupérer que les utilisateurs non-admin
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            ratings: true,
            comments: true
          }
        }
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
