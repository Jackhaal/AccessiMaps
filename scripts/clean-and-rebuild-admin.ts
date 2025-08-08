
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function cleanAndRebuildAdmin() {
  try {
    console.log('🧹 Nettoyage et reconstruction du système admin...\n');
    
    // 1. Supprimer TOUS les comptes admin existants
    console.log('1️⃣ Suppression de tous les comptes admin existants...');
    const deletedAdmins = await prisma.user.deleteMany({
      where: { isAdmin: true }
    });
    console.log(`   ✅ ${deletedAdmins.count} comptes admin supprimés\n`);
    
    // 2. Créer un seul compte admin propre
    console.log('2️⃣ Création d un compte admin unique...');
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const newAdmin = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        name: 'Administrateur Principal',
        password: hashedPassword,
        isAdmin: true,
      }
    });
    console.log(`   ✅ Compte admin créé: ${newAdmin.email}\n`);
    
    // 3. Vérifier le nouveau compte
    console.log('3️⃣ Vérification du nouveau compte...');
    const testPassword = await bcrypt.compare('password', newAdmin.password!);
    console.log(`   📧 Email: ${newAdmin.email}`);
    console.log(`   🔑 Password hash: ${newAdmin.password?.substring(0, 20)}...`);
    console.log(`   🛡️  Admin: ${newAdmin.isAdmin}`);
    console.log(`   ✅ Test password: ${testPassword ? 'SUCCÈS' : 'ÉCHEC'}\n`);
    
    // 4. Vérifier qu'il n'y a qu'un seul admin
    console.log('4️⃣ Vérification finale...');
    const allAdmins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: { id: true, email: true, isAdmin: true }
    });
    console.log(`   📊 Nombre total d'admins: ${allAdmins.length}`);
    console.log(`   📋 Liste: ${JSON.stringify(allAdmins, null, 2)}\n`);
    
    console.log('✅ NETTOYAGE TERMINÉ AVEC SUCCÈS !');
    console.log('📋 Identifiants finaux:');
    console.log('   📧 Email: admin@admin.com');
    console.log('   🔑 Password: password');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndRebuildAdmin();
