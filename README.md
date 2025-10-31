# Baraaka - Application de Gestion de Budget Personnel

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

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (graphiques)
- **Lucide React** (icônes)
- **localStorage** (stockage des données)
- **React Context** (gestion de l'état d'authentification)

## Installation

1. Cloner le projet :
```bash
git clone <votre-repo>
cd Baraaka
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm start` : Lance l'application en mode production

## Structure du projet

```
Baraaka/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Landing page
│   ├── login/             # Page de connexion
│   ├── register/          # Page d'inscription
│   ├── dashboard/         # Dashboard principal
│   ├── transactions/      # Gestion des transactions
│   ├── categories/        # Gestion des catégories
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants UI (Button, Card, Input, etc.)
│   ├── Header.tsx        # En-tête de navigation
│   └── AuthGuard.tsx     # Protection des routes
├── contexts/             # Contextes React
│   └── AuthContext.tsx   # Contexte d'authentification
├── lib/                  # Utilitaires
│   ├── utils.ts         # Fonctions utilitaires
│   └── storage.ts       # Gestion du localStorage
└── types/               # Types TypeScript
    └── index.ts         # Définitions des types
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

- Hashage basique des mots de passe (simulation)
- Validation des formulaires
- Protection des routes privées
- Déconnexion avec confirmation

## Notes

- Les données sont stockées localement dans le navigateur (localStorage)
- Aucune base de données externe n'est utilisée
- Les catégories par défaut sont créées automatiquement à l'inscription
- L'application fonctionne entièrement côté client

## Améliorations possibles

- Ajout d'une vraie base de données (PostgreSQL, MongoDB)
- Authentification avec JWT ou NextAuth
- Export des données en CSV/Excel
- Définition d'objectifs budgétaires
- Notifications pour les dépenses importantes
- Mode sombre complet
- Application mobile (React Native)

## Licence

MIT
