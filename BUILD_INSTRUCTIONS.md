# Instructions de Build

## Prérequis

- Node.js 18+ installé
- Accès à une base de données MongoDB
- Variable d'environnement `DATABASE_URL` configurée

## Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Générer le client Prisma**
   ```bash
   npm run prisma:generate
   ```

   Si vous rencontrez des erreurs de téléchargement, essayez :
   ```bash
   PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
   ```

3. **Synchroniser le schéma de base de données**
   ```bash
   npm run prisma:push
   ```

## Développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Production

1. **Build l'application**
   ```bash
   npm run build
   ```

2. **Démarrer le serveur de production**
   ```bash
   npm start
   ```

## Résolution de problèmes

### Erreur "@prisma/client did not initialize"

Si vous voyez cette erreur, cela signifie que le client Prisma n'a pas été généré. Exécutez :

```bash
npx prisma generate
```

### Erreur "Failed to fetch engine file"

Si vous rencontrez des problèmes de téléchargement des binaires Prisma :

1. Vérifiez votre connexion internet
2. Essayez avec la variable d'environnement :
   ```bash
   PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
   ```
3. Si derrière un proxy, configurez votre proxy npm

### Erreurs TypeScript

Assurez-vous d'avoir généré le client Prisma avant de build :

```bash
npm run prisma:generate
npm run build
```

## Variables d'environnement requises

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
NEXTAUTH_SECRET="votre-secret-jwt-securise-changez-moi"
```

## Base de données

Le projet utilise MongoDB avec Prisma ORM. Le schéma comprend :

- **User** : Gestion des utilisateurs
- **Category** : Catégories de transactions personnalisées
- **Transaction** : Revenus et dépenses
- **Budget** : Budgets par catégorie (nouveau!)

## Fonctionnalités

✅ Authentification JWT avec cookies sécurisés
✅ Gestion des transactions (revenus/dépenses)
✅ Catégories personnalisables
✅ **Budgets avec alertes automatiques** (nouveau!)
✅ **Dashboard avec statistiques backend** (optimisé!)
✅ **Responsivité mobile perfectionnée** (nouveau!)
✅ Graphiques interactifs (Recharts)
✅ Export PDF et Excel

## Architecture

```
/app
  /api              # Routes API Next.js
    /auth          # Authentification
    /transactions  # CRUD transactions
    /categories    # CRUD catégories
    /budgets       # CRUD budgets (nouveau!)
    /statistics    # Endpoint de statistiques (nouveau!)
  /dashboard       # Page dashboard
  /transactions    # Page transactions
  /categories      # Page catégories

/components
  /ui              # Composants UI réutilisables
  BudgetDialog.tsx # Dialog création budget (nouveau!)
  Header.tsx       # Navigation
  ExportDialog.tsx # Export PDF/Excel

/lib
  auth.ts          # Utilitaires d'authentification
  api.ts           # Client API avec wrappers
  prisma.ts        # Instance Prisma singleton
  utils.ts         # Fonctions utilitaires
  export.ts        # Logique d'export

/prisma
  schema.prisma    # Schéma de base de données

/types
  index.ts         # Types TypeScript
```
