
// Test à exécuter dans la console du navigateur pour diagnostiquer les problèmes GPS
console.log('🧪 Test de diagnostic GPS Frontend');

// 1. Test de support de la géolocalisation
console.log('\n1️⃣ Support de la géolocalisation:');
console.log('  - Navigator.geolocation disponible:', !!navigator.geolocation);
console.log('  - HTTPS:', location.protocol === 'https:');
console.log('  - Localhost:', location.hostname === 'localhost');

// 2. Test des permissions
navigator.permissions.query({name: 'geolocation'}).then(result => {
  console.log('  - Permission actuelle:', result.state);
  result.addEventListener('change', () => {
    console.log('  - Permission changée vers:', result.state);
  });
});

// 3. Test de récupération des coordonnées
console.log('\n2️⃣ Test de récupération GPS:');
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log('✅ Position obtenue:');
      console.log('  - Latitude:', lat);
      console.log('  - Longitude:', lon);
      console.log('  - Précision:', position.coords.accuracy + 'm');
      console.log('  - Timestamp:', new Date(position.timestamp));
      
      // 4. Test de l'API avec ces coordonnées
      console.log('\n3️⃣ Test de l\'API avec coordonnées réelles:');
      fetch(`/api/places?lat=${lat}&lon=${lon}&radius=5`)
        .then(response => response.json())
        .then(data => {
          console.log('✅ API répond avec', data.places.length, 'lieux');
          if (data.places.length > 0) {
            console.log('  - Premier lieu:', data.places[0].name);
            console.log('  - Distance:', data.places[0].distance + 'km');
            console.log('  - Les 3 plus proches:');
            data.places.slice(0, 3).forEach((place, i) => {
              console.log(`    ${i+1}. ${place.name}: ${place.distance}km`);
            });
          }
        })
        .catch(error => {
          console.error('❌ Erreur API:', error);
        });
    },
    (error) => {
      console.error('❌ Erreur géolocalisation:', error.message);
      console.log('  - Code:', error.code);
      console.log('  - Message:', error.message);
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.log('  - Cause: Permission refusée par l\'utilisateur');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('  - Cause: Position non disponible');
          break;
        case error.TIMEOUT:
          console.log('  - Cause: Timeout de la requête');
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
} else {
  console.error('❌ Géolocalisation non supportée');
}

// 5. Test de détection mobile
console.log('\n4️⃣ Détection de l\'environnement:');
console.log('  - User Agent:', navigator.userAgent);
console.log('  - Mobile détecté:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
console.log('  - Largeur écran:', window.innerWidth + 'px');

console.log('\n🎯 Test terminé. Consultez les résultats ci-dessus.');
