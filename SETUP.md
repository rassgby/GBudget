# Guide de configuration - GBudget

Ce guide vous aidera à configurer GBudget avec MongoDB et les fonctionnalités d'export.

## 🚀 Installation

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de MongoDB

Vous avez **deux options** pour MongoDB :

#### Option A : MongoDB Local (Développement)

**Installer MongoDB** :

- **macOS** (avec Homebrew) :
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```

- **Windows** : Téléchargez et installez depuis [mongodb.com/download-center/community](https://www.mongodb.com/try/download/community)

- **Linux (Ubuntu/Debian)** :
  ```bash
  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo systemctl start mongod
  ```

**Vérifier que MongoDB fonctionne** :
```bash
mongosh
# Vous devriez voir une connexion réussie
```

#### Option B : MongoDB Atlas (Cloud - Recommandé pour la production)

1. Créez un compte gratuit sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (le tier gratuit suffit)
3. Créez un utilisateur de base de données
4. Whitelist votre adresse IP (ou `0.0.0.0/0` pour tous)
5. Obtenez votre connection string (bouton "Connect" → "Connect your application")

### 3. Configuration de l'environnement

#### Créer le fichier .env

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` selon votre configuration :

**Pour MongoDB Local** :
```env
# Database MongoDB Local
DATABASE_URL="mongodb://localhost:27017/gbudget"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-unique-ici"
```

**Pour MongoDB Atlas** :
```env
# Database MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/gbudget?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-unique-ici"
```

**Important** : Générez un secret unique pour `NEXTAUTH_SECRET` :

```bash
openssl rand -base64 32
```

### 4. Configuration de Prisma

#### Générer le client Prisma

```bash
npx prisma generate
```

#### Pousser le schéma vers MongoDB

```bash
npx prisma db push
```

Cette commande va créer les collections nécessaires dans MongoDB :
- `users`
- `categories`
- `transactions`

### 5. Démarrer l'application

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

L'application utilise maintenant MongoDB au lieu du localStorage :

- **Avantages** :
  - Données persistantes et distribuées
  - Plus sécurisé (mots de passe hashés avec bcrypt)
  - Authentification JWT avec cookies HttpOnly
  - Relations entre les données
  - Scalabilité (MongoDB Atlas)
  - Backups automatiques (avec Atlas)
  - Réplication et haute disponibilité

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

### Collections MongoDB

#### users
- `_id` : ObjectId
- `name` : Nom de l'utilisateur
- `email` : Email unique
- `password` : Mot de passe hashé
- `createdAt` / `updatedAt` : Timestamps

#### categories
- `_id` : ObjectId
- `name` : Nom de la catégorie
- `color` : Couleur hexadécimale
- `userId` : ObjectId (référence vers users)
- Index unique : `(userId, name)`

#### transactions
- `_id` : ObjectId
- `userId` : ObjectId (référence vers users)
- `type` : 'income' ou 'expense'
- `amount` : Number (montant)
- `category` : String (nom de la catégorie)
- `categoryId` : ObjectId (référence vers categories)
- `description` : String
- `date` : String
- `createdAt` / `updatedAt` : Timestamps

## 🔧 Commandes utiles

### Base de données

```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Réinitialiser la base de données (⚠️ supprime toutes les données)
npx prisma db push --force-reset

# Visualiser les données avec MongoDB Shell
mongosh
use gbudget
db.users.find()
db.transactions.find()
db.categories.find()
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

## 🌐 Déploiement en production

### Recommandations

**MongoDB** : Utilisez MongoDB Atlas pour la production
- Backups automatiques
- Monitoring intégré
- Sécurité renforcée
- Scalabilité automatique
- Tier gratuit disponible (512 MB)

**Hébergement** : Options recommandées
- **Vercel** : Déploiement automatique depuis GitHub, tier gratuit
- **Netlify** : Similaire à Vercel
- **Railway** : Support MongoDB intégré
- **Render** : Bon support pour Next.js

### Configuration pour Vercel

1. Connectez votre repository GitHub à Vercel
2. Ajoutez les variables d'environnement :
   - `DATABASE_URL` : Votre connection string MongoDB Atlas
   - `NEXTAUTH_SECRET` : Votre secret JWT
   - `NEXTAUTH_URL` : Votre URL de production

3. Déployez !

## ❓ Dépannage

### Erreur "Prisma Client not generated"

```bash
npx prisma generate
```

### Erreur de connexion MongoDB

**Local** :
```bash
# Vérifier que MongoDB est démarré
brew services list  # macOS
sudo systemctl status mongod  # Linux
```

**Atlas** :
- Vérifiez que votre IP est whitelistée
- Vérifiez vos identifiants dans l'URL de connexion
- Testez la connexion avec mongosh

### Problème de port

Si le port 3000 est déjà utilisé :

```bash
PORT=3001 npm run dev
```

### Réinitialiser complètement la base de données

**Local** :
```bash
mongosh
use gbudget
db.dropDatabase()
npx prisma db push
```

**Atlas** :
Allez dans l'interface web → Collections → Supprimez la base de données

## 📚 Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Prisma** - ORM pour MongoDB
- **MongoDB** - Base de données NoSQL
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

## 🔒 Sécurité en production

- [ ] Changez le `NEXTAUTH_SECRET` avec une valeur unique et sécurisée
- [ ] Utilisez HTTPS en production
- [ ] Configurez les CORS si nécessaire
- [ ] Limitez l'accès à votre base de données (IP whitelisting)
- [ ] Activez l'authentification à deux facteurs sur MongoDB Atlas
- [ ] Configurez des backups réguliers

Bon budget ! 💰
