# GBudget - Application de Gestion de Budget Personnel

Application Next.js complète pour gérer vos finances personnelles avec suivi des dépenses, revenus et statistiques.

## Fonctionnalités

### Pages
- **Landing Page** : Page d'accueil moderne avec présentation des fonctionnalités
- **Inscription** : Création de compte avec validation
- **Connexion** : Authentification des utilisateurs
- **Dashboard** : Vue d'ensemble avec statistiques, graphiques et transactions récentes
- **Transactions** : Gestion complète des transactions (ajout, modification, suppression)
- **Catégories** : Gestion des catégories personnalisées avec couleurs

### Fonctionnalités principales
- Système d'authentification avec localStorage
- Protection des routes (redirection automatique)
- Catégories par défaut (Alimentation, Transport, Loisirs, etc.)
- Graphiques interactifs (Recharts) :
  - Répartition des dépenses par catégorie
  - Évolution mensuelle revenus vs dépenses
- Filtres et recherche pour les transactions
- Calcul automatique des totaux et du solde
- Design responsive (mobile-first)
- Interface moderne avec Tailwind CSS

## Stack Technique

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (graphiques)
- **Lucide React** (icônes)
- **React Context** (gestion de l'état d'authentification)

### Backend
- **Prisma ORM** (gestion de la base de données)
- **MongoDB** (base de données NoSQL)
- **Next.js API Routes** (endpoints REST)
- **bcryptjs** (hashage sécurisé des mots de passe)

> **Note :** Le projet peut fonctionner avec localStorage (frontend uniquement) ou avec le backend MongoDB. Voir [BACKEND.md](./BACKEND.md) pour la configuration du backend.

## Installation

1. Cloner le projet :
```bash
git clone <votre-repo>
cd GBudget
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Configurer le backend (optionnel) :
```bash
# Copier le fichier .env.example
cp .env.example .env

# Éditer .env et ajouter votre URL MongoDB
# DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/gbudget"

# Générer le client Prisma
npm run prisma:generate

# Pousser le schéma vers MongoDB
npm run prisma:push
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

> **Pour une configuration détaillée du backend, consultez [BACKEND.md](./BACKEND.md)**

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm start` : Lance l'application en mode production
- `npm run prisma:generate` : Génère le client Prisma
- `npm run prisma:push` : Pousse le schéma vers MongoDB
- `npm run prisma:studio` : Ouvre l'interface graphique Prisma Studio

## Structure du projet

```
GBudget/
├── app/                         # Pages Next.js (App Router)
│   ├── api/                     # API Routes (Backend)
│   │   ├── auth/               # Authentification (login, register, me)
│   │   ├── transactions/       # CRUD transactions + stats
│   │   └── categories/         # CRUD catégories
│   ├── page.tsx                # Landing page
│   ├── login/                  # Page de connexion
│   ├── register/               # Page d'inscription
│   ├── dashboard/              # Dashboard principal
│   ├── transactions/           # Gestion des transactions
│   ├── categories/             # Gestion des catégories
│   ├── layout.tsx              # Layout principal
│   └── globals.css             # Styles globaux
├── components/                 # Composants React
│   ├── ui/                    # Composants UI (Button, Card, Input, etc.)
│   ├── Header.tsx             # En-tête de navigation
│   └── AuthGuard.tsx          # Protection des routes
├── contexts/                  # Contextes React
│   └── AuthContext.tsx        # Contexte d'authentification
├── lib/                       # Utilitaires
│   ├── utils.ts              # Fonctions utilitaires
│   ├── storage.ts            # Gestion du localStorage
│   ├── prisma.ts             # Client Prisma
│   └── auth.ts               # Utilitaires d'authentification
├── prisma/                    # Configuration Prisma
│   └── schema.prisma         # Schéma de la base de données
├── types/                     # Types TypeScript
│   └── index.ts              # Définitions des types
├── .env                       # Variables d'environnement (à créer)
├── .env.example               # Exemple de variables d'environnement
└── BACKEND.md                 # Documentation du backend
```

## Utilisation

### 1. Créer un compte
- Cliquez sur "Inscription" dans le header
- Remplissez le formulaire (nom, email, mot de passe)
- Vous serez automatiquement connecté et redirigé vers le dashboard

### 2. Ajouter une transaction
- Allez sur la page "Transactions"
- Cliquez sur "Nouvelle transaction"
- Remplissez le formulaire (type, montant, catégorie, description, date)
- La transaction apparaîtra dans la liste et les statistiques seront mises à jour

### 3. Gérer les catégories
- Allez sur la page "Catégories"
- Cliquez sur "Nouvelle catégorie"
- Choisissez un nom et une couleur
- Les catégories personnalisées apparaîtront dans les formulaires de transactions

### 4. Visualiser les statistiques
- Le dashboard affiche :
  - Total des revenus, dépenses et solde
  - Graphique des dépenses par catégorie
  - Évolution mensuelle
  - 5 dernières transactions

## Sécurité

### Frontend
- Validation des formulaires
- Protection des routes privées (AuthGuard)
- Déconnexion avec confirmation

### Backend
- Hashage des mots de passe avec bcrypt (10 rounds)
- Validation des emails et mots de passe
- Vérification de propriété des données (userId)
- Protection contre l'injection SQL/NoSQL (via Prisma)
- Contraintes d'unicité sur les emails
- Relations en cascade pour l'intégrité des données

## Notes

- **Deux modes de stockage disponibles :**
  - **localStorage** : Stockage local dans le navigateur (aucune configuration requise)
  - **MongoDB + Prisma** : Base de données persistante (nécessite configuration, voir [BACKEND.md](./BACKEND.md))
- Les catégories par défaut sont créées automatiquement à l'inscription
- Le backend utilise Next.js API Routes pour les endpoints REST
- Hashage sécurisé des mots de passe avec bcrypt
- Relations en cascade : supprimer un utilisateur ou une catégorie supprime les données associées

## Améliorations possibles

- ✅ ~~Ajout d'une vraie base de données (MongoDB avec Prisma)~~ - **Implémenté !**
- ✅ ~~API Backend REST~~ - **Implémenté !**
- Authentification avec JWT tokens et sessions
- Middleware d'authentification pour protéger les routes API
- Export des données en CSV/Excel
- Définition d'objectifs budgétaires
- Notifications pour les dépenses importantes
- Mode sombre complet
- Application mobile (React Native)
- Tests unitaires et d'intégration
- Pagination pour les transactions
- Recherche et filtres avancés

## Licence

MIT
