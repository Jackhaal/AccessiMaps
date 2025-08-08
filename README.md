
# 📍 AccessiMaps - Plateforme d'Accessibilité

> Une application web dédiée au catalogage et à l'évaluation de l'accessibilité des lieux publics pour les personnes en situation de handicap.

## 🎯 Mission

**AccessiMaps** permet aux utilisateurs de :
- 🔍 Rechercher des lieux accessibles près de chez eux
- ⭐ Évaluer l'accessibilité sur 6 critères spécifiques
- 💬 Partager leurs expériences avec la communauté
- 📷 Ajouter des photos pour illustrer l'accessibilité

## ✨ Fonctionnalités Principales

### 👥 Pour les Utilisateurs
- **Recherche avancée** : Filtrage par ville, type de lieu, notes
- **Évaluation multicritères** : 6 aspects d'accessibilité
  - 🦽 Mobilité réduite
  - 👁️ Déficience visuelle
  - 👂 Déficience auditive
  - 🚻 Toilettes adaptées
  - 🅿️ Parking accessible
  - 🐕‍🦺 Chiens guides acceptés
- **Commentaires détaillés** : Partage d'expériences avec photos
- **Profil personnalisé** : Suivi de vos contributions

### 🛠️ Pour les Administrateurs
- **Dashboard complet** : Gestion de l'application
- **Modération** : Validation des contenus
- **Gestion des utilisateurs** : Administration des comptes
- **Statistiques** : Analytics d'utilisation

## 🏗️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix UI** - Composants accessibles
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - API REST
- **NextAuth.js** - Authentification
- **Prisma** - ORM pour base de données
- **PostgreSQL** - Base de données relationnelle

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 12+
- Git

### Installation
```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/accessilieux.git
cd accessilieux

# 2. Installer les dépendances
npm install

# 3. Configurer la base de données
cp .env.example .env.local
# Éditer .env.local avec vos paramètres

# 4. Setup Prisma
npx prisma generate
npx prisma migrate dev

# 5. Créer un administrateur
npm run create-admin

# 6. Démarrer l'application
npm run dev
```

L'application sera disponible sur http://localhost:3000

## 📋 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` basé sur `.env.example` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/accessilieux_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-securise"
```

### Base de Données

L'application utilise PostgreSQL avec Prisma. Le schéma inclut :
- **Users** : Comptes utilisateurs avec rôles
- **Places** : Lieux référencés avec géolocalisation
- **Ratings** : Évaluations multicritères
- **Comments** : Commentaires avec système de réponses

## 🎯 Utilisation

### Connexion Administrateur
```
Email : superadmin@accessilieux.fr
Mot de passe : AccessiAdmin2024!
```

### URLs Principales
- **Accueil** : http://localhost:3000
- **Recherche** : http://localhost:3000/places
- **Connexion** : http://localhost:3000/auth/signin
- **Admin** : http://localhost:3000/admin

## 🧪 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build
npm start

# Base de données
npx prisma studio          # Interface admin BDD
npx prisma migrate dev      # Appliquer migrations
npx prisma generate         # Générer client

# Administration
npm run create-admin        # Créer compte admin
```

## 📁 Structure du Projet

```
app/
├── app/                    # Routes Next.js
│   ├── (auth)/            # Pages d'authentification
│   ├── admin/             # Interface administrateur
│   ├── api/               # API routes
│   └── places/            # Pages des lieux
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires et configuration
├── prisma/                # Schéma et migrations
└── public/                # Ressources statiques
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- 📧 Email : support@accessilieux.fr
- 🐛 Issues : GitHub Issues
- 📖 Documentation : `/docs`

## 🌟 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible et à la communauté qui partage ses expériences pour rendre le monde plus accessible.

---

**AccessiMaps** 
