
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function verifyAdminAccess() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return { isValid: false, error: 'Non authentifié' }
    }

    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
      return { isValid: false, error: 'Accès non autorisé - droits administrateur requis' }
    }

    return { isValid: true, userId: session.user.id }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return { isValid: false, error: 'Erreur de vérification' }
  }
}
