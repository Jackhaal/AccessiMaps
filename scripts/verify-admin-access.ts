
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function verifyAdminAccess() {
  try {
    console.log('🔍 Vérification finale de l\'accès admin...\n');
    
    // 1. Vérifier le compte admin
    console.log('1️⃣ Vérification du compte admin...');
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' },
      select: { id: true, email: true, name: true, password: true, isAdmin: true }
    });
    
    if (!admin) {
      console.log('❌ ERREUR: Aucun compte admin trouvé avec admin@admin.com');
      return;
    }
    
    console.log(`   ✅ Compte trouvé: ${admin.email}`);
    console.log(`   👤 Nom: ${admin.name}`);
    console.log(`   🛡️  Admin: ${admin.isAdmin}`);
    
    // 2. Tester le mot de passe
    console.log('\n2️⃣ Test du mot de passe...');
    if (!admin.password) {
      console.log('❌ ERREUR: Pas de mot de passe défini');
      return;
    }
    
    const passwordTest = await bcrypt.compare('password', admin.password);
    console.log(`   🔑 Test password "password": ${passwordTest ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    
    if (!passwordTest) {
      console.log('❌ ERREUR: Le mot de passe "password" ne fonctionne pas');
      return;
    }
    
    // 3. Compter tous les admins
    console.log('\n3️⃣ Vérification des doublons...');
    const adminCount = await prisma.user.count({
      where: { isAdmin: true }
    });
    console.log(`   📊 Nombre total d'admins: ${adminCount}`);
    
    if (adminCount > 1) {
      console.log('⚠️  ATTENTION: Plus d\'un compte admin existe');
      const allAdmins = await prisma.user.findMany({
        where: { isAdmin: true },
        select: { email: true, isAdmin: true }
      });
      console.log('   📋 Liste des admins:', allAdmins);
    }
    
    // 4. Résumé final
    console.log('\n🎯 RÉSUMÉ FINAL:');
    console.log(`   📧 Email: admin@admin.com`);
    console.log(`   🔑 Password: password`);
    console.log(`   ✅ Status: ${passwordTest && admin.isAdmin ? 'PRÊT POUR CONNEXION' : 'PROBLÈME DÉTECTÉ'}`);
    
    console.log('\n🚀 INSTRUCTIONS:');
    console.log('   1. Allez sur http://localhost:3000/admin');
    console.log('   2. Connectez-vous avec admin@admin.com / password');
    console.log('   3. Vous devriez accéder au dashboard admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdminAccess();
