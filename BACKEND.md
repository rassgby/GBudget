# Backend GBudget - Documentation

## 📚 Vue d'ensemble

Le backend de GBudget est construit avec :
- **Prisma ORM** : Pour la gestion de la base de données
- **MongoDB** : Base de données NoSQL
- **Next.js API Routes** : Pour les endpoints REST
- **bcryptjs** : Pour le hashage sécurisé des mots de passe

## 🗄️ Modèles de données

### User
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  transactions Transaction[]
  categories   Category[]
}
```

### Category
```prisma
model Category {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  color     String
  userId    String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
}
```

### Transaction
```prisma
model Transaction {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  type        String   // 'income' or 'expense'
  amount      Float
  description String
  date        DateTime
  userId      String   @db.ObjectId
  categoryId  String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user     User     @relation(fields: [userId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
}
```

## 🚀 Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# MongoDB Database URL
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/gbudget?retryWrites=true&w=majority"

# JWT Secret (optionnel pour l'instant)
JWT_SECRET="your-secret-key-here"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### Options pour MongoDB :

**Option 1 : MongoDB Atlas (Cloud - Recommandé)**
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Obtenez votre connection string
4. Remplacez `DATABASE_URL` dans `.env`

**Option 2 : MongoDB Local**
```bash
# Installer MongoDB localement
# MacOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Démarrer MongoDB
mongod

# Utiliser cette URL
DATABASE_URL="mongodb://localhost:27017/gbudget"
```

### 2. Initialiser Prisma

```bash
# Générer le client Prisma
npm run prisma:generate

# Pousser le schéma vers la base de données
npm run prisma:push
```

### 3. Lancer l'application

```bash
npm run dev
```

## 📡 API Endpoints

### Authentification

#### POST `/api/auth/register`
Créer un nouveau compte utilisateur.

**Body :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201) :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Se connecter avec un compte existant.

**Body :**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200) :**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/auth/me?userId=...`
Obtenir les informations de l'utilisateur connecté.

**Response (200) :**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Catégories

#### GET `/api/categories?userId=...`
Récupérer toutes les catégories d'un utilisateur.

**Response (200) :**
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Alimentation",
      "color": "#10b981",
      "userId": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/categories`
Créer une nouvelle catégorie.

**Body :**
```json
{
  "name": "Sport",
  "color": "#3b82f6",
  "userId": "..."
}
```

**Response (201) :**
```json
{
  "message": "Catégorie créée avec succès",
  "category": {
    "id": "...",
    "name": "Sport",
    "color": "#3b82f6",
    "userId": "..."
  }
}
```

#### PUT `/api/categories`
Modifier une catégorie existante.

**Body :**
```json
{
  "id": "...",
  "name": "Fitness",
  "color": "#8b5cf6",
  "userId": "..."
}
```

#### DELETE `/api/categories?id=...&userId=...`
Supprimer une catégorie (supprime aussi les transactions liées).

### Transactions

#### GET `/api/transactions?userId=...`
Récupérer toutes les transactions d'un utilisateur.

**Response (200) :**
```json
{
  "transactions": [
    {
      "id": "...",
      "type": "expense",
      "amount": 50.00,
      "description": "Courses",
      "date": "2024-01-01T00:00:00.000Z",
      "userId": "...",
      "categoryId": "...",
      "category": {
        "id": "...",
        "name": "Alimentation",
        "color": "#10b981"
      }
    }
  ]
}
```

#### POST `/api/transactions`
Créer une nouvelle transaction.

**Body :**
```json
{
  "type": "expense",
  "amount": 50.00,
  "description": "Courses du samedi",
  "date": "2024-01-01",
  "userId": "...",
  "categoryId": "..."
}
```

**Response (201) :**
```json
{
  "message": "Transaction créée avec succès",
  "transaction": {
    "id": "...",
    "type": "expense",
    "amount": 50.00,
    "description": "Courses du samedi",
    "date": "2024-01-01T00:00:00.000Z",
    "category": { ... }
  }
}
```

#### PUT `/api/transactions`
Modifier une transaction existante.

**Body :**
```json
{
  "id": "...",
  "amount": 55.00,
  "description": "Courses + essence",
  "userId": "..."
}
```

#### DELETE `/api/transactions?id=...&userId=...`
Supprimer une transaction.

#### GET `/api/transactions/stats?userId=...`
Obtenir les statistiques des transactions.

**Response (200) :**
```json
{
  "stats": {
    "totalIncome": 3000.00,
    "totalExpenses": 1500.00,
    "balance": 1500.00,
    "transactionCount": 25
  },
  "expensesByCategory": [
    {
      "name": "Alimentation",
      "total": 400.00,
      "color": "#10b981"
    }
  ],
  "monthlyData": [
    {
      "month": "janv.",
      "revenus": 1000,
      "dépenses": 500
    }
  ]
}
```

## 🛠️ Scripts utiles

```bash
# Générer le client Prisma après modification du schema
npm run prisma:generate

# Pousser les modifications du schema vers la base de données
npm run prisma:push

# Ouvrir Prisma Studio (interface graphique pour voir vos données)
npm run prisma:studio

# Lancer le serveur de développement
npm run dev
```

## 🔒 Sécurité

### Hashage des mots de passe
Les mots de passe sont hashés avec bcrypt (10 rounds) avant d'être stockés :
```typescript
import { hashPassword, comparePassword } from '@/lib/auth';

// Hash un mot de passe
const hashed = await hashPassword('password123');

// Comparer un mot de passe
const isValid = await comparePassword('password123', hashed);
```

### Validation
- Email : Validation du format
- Mot de passe : Minimum 6 caractères
- Montants : Doivent être positifs
- Types de transaction : 'income' ou 'expense' uniquement

### Protection des données
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Vérification du `userId` sur toutes les opérations
- Les relations Prisma utilisent `onDelete: Cascade` pour maintenir l'intégrité

## 📊 Relations entre les modèles

```
User (1) ─── (N) Category
  │
  └────── (N) Transaction
              │
              └────── (1) Category
```

- Un utilisateur peut avoir plusieurs catégories et transactions
- Une transaction appartient à un utilisateur et une catégorie
- Supprimer un utilisateur supprime toutes ses catégories et transactions
- Supprimer une catégorie supprime toutes ses transactions associées

## 🐛 Débogage

### Voir les requêtes SQL/MongoDB
Les logs Prisma sont activés en développement. Vous verrez dans la console :
- Les requêtes exécutées
- Les erreurs
- Les warnings

### Prisma Studio
Lancez Prisma Studio pour voir et modifier vos données directement :
```bash
npm run prisma:studio
```

### Erreurs courantes

**1. Cannot connect to database**
- Vérifiez votre `DATABASE_URL` dans `.env`
- Assurez-vous que MongoDB est démarré (si local)
- Vérifiez vos credentials MongoDB Atlas

**2. PrismaClientInitializationError**
- Exécutez `npm run prisma:generate`
- Vérifiez que le schema Prisma est valide

**3. Unique constraint violation**
- Un email existe déjà lors de l'inscription
- Utilisez un autre email

## 📈 Améliorations futures

- [ ] Authentification JWT avec sessions
- [ ] Middleware d'authentification pour protéger les routes
- [ ] Rate limiting sur les API
- [ ] Pagination pour les transactions
- [ ] Recherche et filtres avancés
- [ ] Export des données en CSV
- [ ] Notifications par email
- [ ] API de webhooks
- [ ] Tests unitaires et d'intégration

## 📝 Licence

MIT
