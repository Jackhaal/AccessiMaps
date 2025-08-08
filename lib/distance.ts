

/**
 * Calcule la distance entre deux points GPS en utilisant la formule de Haversine
 * @param lat1 - Latitude du premier point
 * @param lon1 - Longitude du premier point
 * @param lat2 - Latitude du deuxième point
 * @param lon2 - Longitude du deuxième point
 * @returns Distance en kilomètres
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Rayon de la Terre en kilomètres
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance en kilomètres
  
  return Math.round(distance * 100) / 100 // Arrondir à 2 décimales
}

/**
 * Convertit les degrés en radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Formate la distance pour l'affichage
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance}km`
}

/**
 * Trie un tableau de lieux par distance par rapport à une position
 */
export function sortByDistance<T extends { latitude?: number | null; longitude?: number | null }>(
  places: T[],
  userLat: number,
  userLon: number
): (T & { distance: number })[] {
  return places
    .filter(place => place.latitude !== null && place.longitude !== null)
    .map(place => ({
      ...place,
      distance: calculateDistance(
        userLat,
        userLon,
        place.latitude!,
        place.longitude!
      )
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Filtre les lieux dans un rayon donné
 */
export function filterByRadius<T extends { latitude?: number | null; longitude?: number | null }>(
  places: T[],
  userLat: number,
  userLon: number,
  radiusKm: number
): (T & { distance: number })[] {
  return sortByDistance(places, userLat, userLon)
    .filter(place => place.distance <= radiusKm)
}
