
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuthFlow() {
  try {
    console.log('🔍 Test du flux d\'authentification complet...')
    console.log('')

    // Test 1: Vérifier les comptes admin
    console.log('1. 📊 Vérification des comptes admin:')
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isAdmin: true,
        emailVerified: true,
        createdAt: true
      }
    })

    if (!admin) {
      console.log('   ❌ Compte admin@admin.com non trouvé!')
      return
    }

    console.log('   ✅ Compte trouvé:')
    console.log(`     - ID: ${admin.id}`)
    console.log(`     - Nom: ${admin.name}`)
    console.log(`     - Email: ${admin.email}`)
    console.log(`     - Admin: ${admin.isAdmin}`)
    console.log(`     - Email vérifié: ${admin.emailVerified ? 'Oui' : 'Non'}`)
    console.log(`     - Password hash exists: ${admin.password ? 'Oui' : 'Non'}`)

    // Test 2: Vérifier le mot de passe
    console.log('')
    console.log('2. 🔑 Test du mot de passe:')
    if (admin.password) {
      const passwordValid = await bcrypt.compare('password', admin.password)
      console.log(`   ${passwordValid ? '✅' : '❌'} Mot de passe 'password': ${passwordValid ? 'VALIDE' : 'INVALIDE'}`)
    }

    // Test 3: Simuler le processus NextAuth
    console.log('')
    console.log('3. 🔄 Simulation NextAuth authorize():')
    
    const credentials = { email: 'admin@admin.com', password: 'password' }
    
    if (!credentials.email || !credentials.password) {
      console.log('   ❌ Credentials manquantes')
      return
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user?.password) {
      console.log('   ❌ Utilisateur non trouvé ou pas de mot de passe')
      return
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

    if (!isPasswordValid) {
      console.log('   ❌ Mot de passe invalide')
      return
    }

    const authorizeResult = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    console.log('   ✅ Authorize() retournerait:')
    console.log('     ', JSON.stringify(authorizeResult, null, 2))

    // Test 4: Simuler le callback JWT
    console.log('')
    console.log('4. 🎫 Simulation JWT callback:')
    
    const token = {
      id: user.id,
      // Récupérer les informations d'admin depuis la base de données
      isAdmin: user.isAdmin || false
    }

    console.log('   ✅ Token contiendrait:')
    console.log('     ', JSON.stringify(token, null, 2))

    // Test 5: Simuler le callback session
    console.log('')
    console.log('5. 👤 Simulation session callback:')
    
    const session = {
      user: {
        id: token.id,
        email: user.email,
        name: user.name,
        isAdmin: token.isAdmin
      }
    }

    console.log('   ✅ Session contiendrait:')
    console.log('     ', JSON.stringify(session, null, 2))

    // Test 6: Vérifier l'accès admin
    console.log('')
    console.log('6. 🛡️  Vérification accès admin:')
    console.log(`   ${session.user.isAdmin ? '✅' : '❌'} isAdmin = ${session.user.isAdmin}`)
    console.log(`   ${session.user.isAdmin ? '✅ ACCÈS AUTORISÉ' : '❌ ACCÈS REFUSÉ'} au dashboard admin`)

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthFlow()
