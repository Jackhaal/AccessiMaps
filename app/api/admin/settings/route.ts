
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic";

// CETTE API UTILISE MAINTENANT LA BASE DE DONNÉES ET NEXTAUTH
// Plus de fichiers JSON ou d'identifiants en dur

export async function GET() {
  try {
    // Vérifier l'accès admin via NextAuth
    const adminCheck = await verifyAdminAccess()
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: adminCheck.error }, { status: 401 })
    }

    // Retourner les informations de configuration générales
    const adminCount = await prisma.user.count({
      where: { isAdmin: true }
    })

    return NextResponse.json({
      adminCount,
      authMethod: 'NextAuth with Database',
      status: 'active'
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Fonctionnalité obsolète. Utilisez la gestion des comptes admin via la base de données.',
      redirect: '/admin/admins'
    }, 
    { status: 410 }
  )
}
