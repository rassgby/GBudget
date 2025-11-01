# Guide complet - Ajouter des transactions (budgets)

## ✅ Tout est déjà en place !

L'application Baraaka dispose déjà de toutes les fonctionnalités nécessaires pour gérer vos transactions (revenus et dépenses). Voici comment l'utiliser :

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration de la base de données](#configuration-de-la-base-de-données)
3. [Comment ajouter une transaction](#comment-ajouter-une-transaction)
4. [Gestion des catégories](#gestion-des-catégories)
5. [Résolution des problèmes](#résolution-des-problèmes)

---

## Prérequis

### 1. Créer un fichier `.env`

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

### 2. Configuration de MongoDB

Vous avez deux options :

#### Option A : MongoDB Local

```env
DATABASE_URL="mongodb://localhost:27017/baraaka"
```

#### Option B : MongoDB Atlas (Cloud - Recommandé)

1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster gratuit
3. Créez un utilisateur de base de données
4. Autorisez votre adresse IP (ou 0.0.0.0/0 pour tout autoriser)
5. Obtenez votre URL de connexion et mettez-la dans `.env` :

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/baraaka?retryWrites=true&w=majority"
```

### 3. Installation et démarrage

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npm run prisma:generate

# Pousser le schéma vers la base de données
npm run prisma:push

# Démarrer l'application
npm run dev
```

L'application sera accessible sur http://localhost:3000

---

## Configuration de la base de données

### Première utilisation

1. **Créer un compte** : Allez sur http://localhost:3000/register
   - Les catégories par défaut seront créées automatiquement
   - Catégories de dépenses : Alimentation, Transport, Loisirs, Santé, Logement, Shopping, Éducation, Autres
   - Catégorie de revenus : Salaire

2. **Si vous avez un compte existant sans catégories** :
   ```bash
   npm run prisma:seed
   ```
   Ce script ajoutera les catégories par défaut à tous les utilisateurs qui n'en ont pas.

---

## Comment ajouter une transaction

### Méthode 1 : Depuis le Dashboard

1. Connectez-vous à votre compte
2. Sur le Dashboard, cliquez sur **"Nouvelle transaction"**
3. Remplissez le formulaire :
   - **Type** : Revenu ou Dépense
   - **Montant** : Le montant en FCFA
   - **Catégorie** : Choisissez une catégorie (la liste change selon le type)
   - **Description** : Ex: "Courses du mois", "Salaire de novembre"
   - **Date** : La date de la transaction
4. Cliquez sur **"Ajouter"**

### Méthode 2 : Depuis la page Transactions

1. Allez sur http://localhost:3000/transactions
2. Cliquez sur **"Nouvelle transaction"** ou **"Ajouter"**
3. Remplissez le formulaire (même que ci-dessus)
4. Cliquez sur **"Ajouter"**

### Modifier ou supprimer une transaction

Sur la page des transactions :
- **Modifier** : Cliquez sur l'icône crayon ✏️
- **Supprimer** : Cliquez sur l'icône poubelle 🗑️

---

## Gestion des catégories

### Voir vos catégories

Allez sur http://localhost:3000/categories

### Ajouter une nouvelle catégorie

1. Sur la page Catégories, cliquez sur **"Nouvelle catégorie"**
2. Entrez le nom (ex: "Épargne", "Investissement")
3. Choisissez une couleur
4. Cliquez sur **"Ajouter"**

### Modifier ou supprimer une catégorie

- **Modifier** : Cliquez sur l'icône crayon
- **Supprimer** : Cliquez sur l'icône poubelle
  - ⚠️ Vous ne pouvez pas supprimer une catégorie si des transactions l'utilisent

### Catégories par défaut

Les catégories suivantes sont créées automatiquement lors de l'inscription :

**Dépenses :**
- 🥗 Alimentation (vert)
- 🚗 Transport (bleu)
- 🎮 Loisirs (violet)
- 🏥 Santé (rouge)
- 🏠 Logement (orange)
- 🛍️ Shopping (rose)
- 📚 Éducation (teal)
- 📦 Autres (gris)

**Revenus :**
- 💰 Salaire (vert)

---

## Résolution des problèmes

### Problème 1 : "Aucune catégorie disponible"

**Solution :**
```bash
npm run prisma:seed
```

Cela créera les catégories par défaut pour votre compte.

### Problème 2 : Erreur "Non authentifié" lors de l'ajout d'une transaction

**Causes possibles :**
1. Vous n'êtes pas connecté → Reconnectez-vous
2. Votre session a expiré → Reconnectez-vous
3. Problème de cookies → Videz le cache du navigateur

**Solution :**
- Déconnectez-vous et reconnectez-vous
- Essayez en mode navigation privée
- Vérifiez que les cookies sont activés dans votre navigateur

### Problème 3 : Erreur "Erreur lors de la sauvegarde"

**Causes possibles :**
1. Base de données non connectée
2. Champs manquants dans le formulaire

**Solutions :**
1. Vérifiez que MongoDB est démarré (si local)
2. Vérifiez votre URL de connexion dans `.env`
3. Vérifiez que tous les champs du formulaire sont remplis
4. Vérifiez la console du navigateur (F12) pour plus de détails

### Problème 4 : La base de données ne démarre pas

**Si vous utilisez MongoDB local :**
```bash
# Sur Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod

# Sur macOS avec Homebrew
brew services start mongodb-community

# Sur Windows
# Lancez MongoDB depuis les Services Windows
```

**Si vous utilisez MongoDB Atlas :**
- Vérifiez que votre IP est autorisée
- Vérifiez que l'URL de connexion est correcte
- Vérifiez que l'utilisateur et le mot de passe sont corrects

### Problème 5 : Erreur Prisma lors de `npm run prisma:generate`

**Solution :**
```bash
# Nettoyer et réinstaller
rm -rf node_modules
rm -rf .next
npm install
npm run prisma:generate
```

---

## API Endpoints

Pour les développeurs, voici les endpoints disponibles :

### Transactions
- `GET /api/transactions` - Récupérer toutes les transactions
- `POST /api/transactions` - Créer une transaction
- `PUT /api/transactions/[id]` - Modifier une transaction
- `DELETE /api/transactions/[id]` - Supprimer une transaction

### Catégories
- `GET /api/categories` - Récupérer toutes les catégories
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/[id]` - Modifier une catégorie
- `DELETE /api/categories/[id]` - Supprimer une catégorie

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Vérifier la session

---

## Structure de données

### Transaction
```typescript
{
  type: 'income' | 'expense',  // Type de transaction
  amount: number,               // Montant en FCFA
  category: string,             // Nom de la catégorie
  categoryId?: string,          // ID de la catégorie (optionnel)
  description: string,          // Description
  date: string                  // Date au format YYYY-MM-DD
}
```

### Catégorie
```typescript
{
  name: string,   // Nom de la catégorie
  color: string   // Couleur hexadécimale (ex: #10b981)
}
```

---

## Commandes utiles

```bash
# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start

# Ouvrir Prisma Studio (interface graphique pour la BD)
npm run prisma:studio

# Ajouter les catégories par défaut
npm run prisma:seed

# Générer le client Prisma
npm run prisma:generate

# Pousser les changements du schéma
npm run prisma:push
```

---

## Notes importantes

1. **Sécurité** : Ne partagez jamais votre fichier `.env`
2. **Backup** : Sauvegardez régulièrement votre base de données MongoDB
3. **Type de transaction** :
   - "income" = Revenu (affiché en vert avec +)
   - "expense" = Dépense (affiché en rouge avec -)
4. **Format de date** : Utilisez le format YYYY-MM-DD (ex: 2025-11-01)
5. **Montants** : Toujours en FCFA, valeurs positives uniquement

---

## Support

Si vous rencontrez toujours des problèmes :

1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs du serveur dans votre terminal
3. Assurez-vous que MongoDB est accessible
4. Vérifiez que toutes les dépendances sont installées
5. Essayez de redémarrer le serveur Next.js

Pour plus d'informations sur Prisma : https://www.prisma.io/docs
Pour plus d'informations sur MongoDB : https://docs.mongodb.com/
