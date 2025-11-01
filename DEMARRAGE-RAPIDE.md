# 🚀 Démarrage rapide - Baraaka

## 3 étapes pour commencer

### 1️⃣ Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env
```

Éditez `.env` et configurez votre base de données MongoDB :
```env
DATABASE_URL="mongodb://localhost:27017/baraaka"
# OU
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/baraaka"
```

### 2️⃣ Installation

```bash
# Installer les dépendances
npm install

# Configurer Prisma
npm run prisma:generate
npm run prisma:push
```

### 3️⃣ Lancement

```bash
# Démarrer l'application
npm run dev
```

Ouvrez http://localhost:3000 🎉

---

## ✨ Utilisation

### Première utilisation

1. **Créer un compte** : http://localhost:3000/register
   - Des catégories par défaut seront créées automatiquement

2. **Ajouter une transaction** :
   - Dashboard → "Nouvelle transaction"
   - Ou : http://localhost:3000/transactions

### Pages disponibles

- 🏠 **Dashboard** : `/` - Vue d'ensemble
- 💸 **Transactions** : `/transactions` - Gérer vos revenus/dépenses
- 🏷️ **Catégories** : `/categories` - Gérer vos catégories

---

## 🆘 Problème ?

### Pas de catégories ?
```bash
npm run prisma:seed
```

### Base de données non connectée ?
- Vérifiez que MongoDB est démarré
- Vérifiez l'URL dans `.env`

### Erreur d'authentification ?
- Déconnectez-vous et reconnectez-vous
- Videz le cache du navigateur

---

## 📖 Documentation complète

Pour plus de détails, consultez **[TRANSACTIONS-GUIDE.md](./TRANSACTIONS-GUIDE.md)**

## 🎯 Fonctionnalités principales

✅ Gestion des transactions (revenus/dépenses)
✅ Catégorisation personnalisée
✅ Tableaux de bord avec graphiques
✅ Export Excel/PDF
✅ Mode PWA - Fonctionne hors ligne
✅ Design responsive (mobile/desktop)

---

**Bon budget ! 💰**
