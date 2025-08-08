
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF' },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Taille maximum : 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `place_${timestamp}_${randomString}.${extension}`

    // Créer le chemin de destination
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'places')
    const filepath = path.join(uploadDir, filename)

    // Créer le dossier s'il n'existe pas
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Le dossier existe déjà, on ignore l'erreur
    }

    // Sauvegarder le fichier
    await writeFile(filepath, buffer)

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/places/${filename}`

    return NextResponse.json({ 
      imageUrl,
      filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
