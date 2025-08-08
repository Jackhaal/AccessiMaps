
import { prisma } from '@/lib/db'
import { calculateDistance, sortByDistance, filterByRadius } from '@/lib/distance'

async function debugGPS() {
  try {
    console.log('🔍 Debug GPS - Analyse des données de géolocalisation\n')

    // 1. Vérifier les lieux avec coordonnées GPS
    const placesWithGPS = await prisma.place.findMany({
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        city: true,
        latitude: true,
        longitude: true
      },
      take: 10
    })

    console.log(`📍 Lieux avec coordonnées GPS : ${placesWithGPS.length}`)
    placesWithGPS.forEach(place => {
      console.log(`  - ${place.name} (${place.city}) : lat=${place.latitude}, lon=${place.longitude}`)
    })

    if (placesWithGPS.length === 0) {
      console.log('❌ Aucun lieu n\'a de coordonnées GPS dans la base !')
      return
    }

    // 2. Test avec des coordonnées fictives de Paris
    const parisLat = 48.8566
    const parisLon = 2.3522
    
    console.log(`\n🗼 Test avec coordonnées Paris : lat=${parisLat}, lon=${parisLon}`)

    // 3. Calculer les distances
    const placesWithDistance = placesWithGPS.map(place => ({
      ...place,
      distance: calculateDistance(
        parisLat, parisLon,
        place.latitude as number, 
        place.longitude as number
      )
    }))

    console.log('\n📏 Distances calculées :')
    placesWithDistance.forEach(place => {
      console.log(`  - ${place.name} : ${place.distance}km`)
    })

    // 4. Test de tri par distance
    const sortedPlaces = sortByDistance(placesWithGPS, parisLat, parisLon)
    console.log('\n🔢 Tri par distance (les plus proches) :')
    sortedPlaces.slice(0, 5).forEach((place, index) => {
      console.log(`  ${index + 1}. ${place.name} : ${place.distance}km`)
    })

    // 5. Test de filtrage par rayon (50km)
    const filteredPlaces = filterByRadius(placesWithGPS, parisLat, parisLon, 50)
    console.log(`\n🎯 Lieux dans un rayon de 50km : ${filteredPlaces.length}`)
    filteredPlaces.forEach(place => {
      console.log(`  - ${place.name} : ${place.distance}km`)
    })

    // 6. Test avec l'API complète
    console.log('\n🌐 Test de l\'API places avec géolocalisation...')
    const response = await fetch(`http://localhost:3000/api/places?lat=${parisLat}&lon=${parisLon}&radius=50`)
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ API répond : ${data.places.length} lieux trouvés`)
      data.places.slice(0, 3).forEach((place: any) => {
        console.log(`  - ${place.name} : ${place.distance ? place.distance + 'km' : 'pas de distance'}`)
      })
    } else {
      console.log(`❌ Erreur API : ${response.status}`)
    }

  } catch (error) {
    console.error('❌ Erreur dans debugGPS:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugGPS()
