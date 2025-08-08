
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Initialisation de la base de données...')

  // Créer quelques types de lieux par défaut si nécessaire
  const placeCount = await prisma.place.count()
  
  if (placeCount === 0) {
    console.log('📍 Création de lieux d\'exemple...')
    
    await prisma.place.createMany({
      data: [
        {
          name: 'Bibliothèque Municipale',
          address: '15 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          type: 'AUTRE',
          description: 'Bibliothèque accessible avec rampe d\'accès et ascenseur',
          website: 'https://bibliotheque-exemple.fr',
          phone: '01 23 45 67 89',
          latitude: 48.8566,
          longitude: 2.3522
        },
        {
          name: 'Café des Arts',
          address: '42 Avenue des Champs',
          city: 'Lyon',
          postalCode: '69001',
          type: 'RESTAURANT',
          description: 'Café accessible avec toilettes adaptées',
          phone: '04 78 90 12 34',
          latitude: 45.7640,
          longitude: 4.8357
        },
        {
          name: 'Cinéma Lumière',
          address: '8 Boulevard Victor Hugo',
          city: 'Marseille',
          postalCode: '13001',
          type: 'CINEMA',
          description: 'Cinéma entièrement accessible, places réservées PMR',
          website: 'https://cinema-lumiere.com',
          phone: '04 91 23 45 67',
          latitude: 43.2965,
          longitude: 5.3698
        }
      ]
    })
    console.log('✅ Lieux d\'exemple créés!')
  }

  console.log('✅ Seeding terminé!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
