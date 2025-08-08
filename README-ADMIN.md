
# Documentation Administrateur - AccessiMaps

## Système d'authentification unifié

Le système d'authentification administrateur a été modernisé pour utiliser **uniquement la base de données** avec NextAuth, abandonnant l'ancien système de fichiers avec identifiants par défaut.

## Comptes administrateur

### Connexion admin existante
Un compte administrateur existe déjà dans la base de données :
- **Email** : admin@accessilieux.com
- **Mot de passe** : Utilisez le mot de passe configuré lors de la création du compte

### Accès à l'interface admin
1. Allez sur : http://localhost:3000/admin
2. Si vous n'êtes pas connecté, vous serez redirigé vers la page de connexion
3. Connectez-vous avec les identifiants admin
4. Vous accéderez automatiquement au tableau de bord admin

## Gestion des comptes administrateur

### Créer un nouvel administrateur
Vous pouvez créer de nouveaux comptes admin de deux façons :

#### 1. Via l'interface web (recommandé)
1. Connectez-vous en tant qu'admin
2. Allez dans "Gestion des admins" dans la sidebar
3. Cliquez sur "Ajouter un administrateur"
4. Remplissez les informations requises

#### 2. Via les scripts en ligne de commande
```bash
# Script interactif pour créer un admin
npm run create-admin

# Script automatique pour vérifier/créer l'admin par défaut
npm run init-admin
```

### Promouvoir un utilisateur existant
1. Dans l'interface admin, allez dans "Gestion des utilisateurs"
2. Trouvez l'utilisateur à promouvoir
3. Cliquez sur "Promouvoir admin"

## Fonctionnalités admin disponibles

### Tableau de bord
- Statistiques générales de la plateforme
- Activité récente des utilisateurs

### Gestion des utilisateurs
- Liste de tous les utilisateurs inscrits
- Bannir/débannir des utilisateurs
- Promouvoir des utilisateurs en tant qu'admin

### Gestion des lieux
- Modération des lieux ajoutés
- Édition des informations des lieux
- Suppression de lieux inappropriés

### Gestion des commentaires
- Modération des commentaires
- Possibilité de supprimer des commentaires
- Gestion des réponses aux commentaires

### Gestion des évaluations
- Vue d'ensemble des évaluations
- Suppression d'évaluations inappropriées

### Gestion des administrateurs
- Liste des comptes admin
- Création de nouveaux administrateurs
- Modification des mots de passe admin
- Révocation des droits admin

## Sécurité

### Authentification
- Utilise NextAuth avec base de données PostgreSQL
- Mots de passe hachés avec bcrypt (12 rounds)
- Vérification du statut admin à chaque requête

### Protection des routes
- Toutes les routes `/admin/*` nécessitent une authentification
- Vérification du statut `isAdmin: true` dans la base de données
- Redirection automatique vers la connexion si non autorisé

### Middleware de sécurité
- Vérification des permissions sur toutes les API admin
- Sessions JWT sécurisées
- Protection CSRF intégrée

## Dépannage

### Problème de connexion admin
1. Vérifiez que le compte existe : `npm run init-admin`
2. Vérifiez les logs de l'application pour les erreurs
3. Assurez-vous que la base de données est connectée

### Réinitialiser un mot de passe admin
Utilisez le script interactif :
```bash
npm run create-admin
# Choisissez l'option de promotion si le compte existe
```

### Base de données corrompue
Recréez les tables avec Prisma :
```bash
npx prisma db reset
npx prisma db seed
npm run init-admin
```

## Migration depuis l'ancien système

L'ancien système utilisant des fichiers JSON (`admin-settings.json`) est maintenant **obsolète**. Les routes `/api/admin/auth` retournent maintenant une erreur 410 et redirigent vers le nouveau système.

Si vous aviez des anciens identifiants admin, ils ne fonctionneront plus. Utilisez les nouveaux comptes créés dans la base de données.
