

export const dynamic = "force-dynamic";
// Cette API est désormais obsolète - l'authentification admin utilise NextAuth et la base de données
// Toute tentative d'accès redirigera vers le système d'authentification principal

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Cette méthode d\'authentification est obsolète. Utilisez le système de connexion principal.',
      redirect: '/auth/signin' 
    }, 
    { status: 410 }
  )
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Cette méthode d\'authentification est obsolète. Utilisez le système de connexion principal.',
      redirect: '/auth/signin' 
    }, 
    { status: 410 }
  )
}
