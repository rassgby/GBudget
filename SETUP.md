# Guide de configuration - GBudget

Ce guide vous aidera à configurer GBudget avec la nouvelle base de données et les fonctionnalités d'export.

## 🚀 Installation

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de la base de données

#### Créer le fichier .env

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` si nécessaire :

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-unique-ici"
```

**Important** : Générez un secret unique pour `NEXTAUTH_SECRET` :

```bash
openssl rand -base64 32
```

#### Générer le client Prisma

```bash
npx prisma generate
```

#### Créer la base de données

```bash
npx prisma db push
```

Cette commande va créer le fichier `prisma/dev.db` avec toutes les tables nécessaires.

### 3. Démarrer l'application

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📊 Nouvelles fonctionnalités

### Export PDF et Excel

- **Bouton "Exporter"** disponible dans :
  - Page Transactions
  - Dashboard

- **Filtres disponibles** :
  - Période (date de début et fin)
  - Type de transaction (Tous / Revenus / Dépenses)
  - Catégories (sélection multiple)
  - Montant minimum et maximum

- **Formats d'export** :
  - **PDF** : Document formaté avec statistiques et tableau
  - **Excel** : Fichier .xlsx avec 3 feuilles (Transactions, Filtres, Par Catégorie)

### Base de données

L'application utilise maintenant une vraie base de données (SQLite) au lieu du localStorage :

- **Avantages** :
  - Données persistantes
  - Plus sécurisé (mots de passe hashés avec bcrypt)
  - Authentification JWT avec cookies HttpOnly
  - Relations entre les données
  - Possibilité de migrer vers PostgreSQL en production

## 🔐 Authentification

L'authentification a été complètement refaite :

- Mots de passe hashés avec bcryptjs (10 rounds)
- Tokens JWT stockés dans des cookies HttpOnly sécurisés
- Durée de session : 7 jours
- API routes protégées avec middleware d'authentification

## 📱 Responsivité

L'application est entièrement responsive et optimisée pour :

- 📱 Mobile (320px et plus)
- 📱 Tablette (768px et plus)
- 💻 Desktop (1024px et plus)
- 🖥️ Large desktop (1280px et plus)

## 🗄️ Structure de la base de données

### Tables

#### users
- `id` : UUID
- `name` : Nom de l'utilisateur
- `email` : Email unique
- `password` : Mot de passe hashé
- `createdAt` / `updatedAt` : Timestamps

#### categories
- `id` : UUID
- `name` : Nom de la catégorie
- `color` : Couleur hexadécimale
- `userId` : Référence vers l'utilisateur
- Contrainte unique : `(userId, name)`

#### transactions
- `id` : UUID
- `userId` : Référence vers l'utilisateur
- `type` : 'income' ou 'expense'
- `amount` : Montant (float)
- `category` : Nom de la catégorie
- `categoryId` : Référence vers la catégorie (optionnelle)
- `description` : Description
- `date` : Date de la transaction
- `createdAt` / `updatedAt` : Timestamps

## 🔧 Commandes utiles

### Base de données

```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Réinitialiser la base de données
npx prisma db push --force-reset

# Voir les migrations
npx prisma migrate dev
```

### Développement

```bash
# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start

# Vérifier les erreurs TypeScript
npm run lint
```

## 📝 API Routes

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Récupérer l'utilisateur connecté

### Catégories

- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/[id]` - Modifier une catégorie
- `DELETE /api/categories/[id]` - Supprimer une catégorie

### Transactions

- `GET /api/transactions` - Liste des transactions
- `POST /api/transactions` - Créer une transaction
- `PUT /api/transactions/[id]` - Modifier une transaction
- `DELETE /api/transactions/[id]` - Supprimer une transaction

## 🚨 Migration vers PostgreSQL (Production)

Pour passer à PostgreSQL en production :

1. Installer PostgreSQL
2. Modifier `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Modifier `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gbudget?schema=public"
```

4. Exécuter les migrations :

```bash
npx prisma migrate dev
```

## ❓ Dépannage

### Erreur "Prisma Client not generated"

```bash
npx prisma generate
```

### Erreur de base de données

```bash
npx prisma db push --force-reset
```

**⚠️ Attention** : Cela supprimera toutes les données !

### Problème de port

Si le port 3000 est déjà utilisé :

```bash
PORT=3001 npm run dev
```

## 📚 Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la base de données
- **SQLite** - Base de données (dev)
- **bcryptjs** - Hachage des mots de passe
- **jose** - JWT pour l'authentification
- **jsPDF** - Génération de PDF
- **xlsx** - Génération de fichiers Excel
- **Recharts** - Graphiques
- **Tailwind CSS** - Styling

## 🎉 Prochaines étapes

L'application est maintenant prête à être utilisée ! Vous pouvez :

1. Créer un compte utilisateur
2. Ajouter des catégories personnalisées
3. Enregistrer vos transactions
4. Visualiser vos statistiques dans le dashboard
5. Exporter vos données en PDF ou Excel

Bon budget ! 💰
