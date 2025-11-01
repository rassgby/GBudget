# Guide PWA et Mode Offline

## Fonctionnalités PWA implémentées

L'application Baraaka est maintenant une Progressive Web App (PWA) complète avec support offline.

### Fichiers créés/modifiés :
- ✅ `public/manifest.json` - Configuration PWA
- ✅ `public/sw.js` - Service Worker pour le cache offline
- ✅ `public/icon.svg` - Icône de l'application
- ✅ `components/PWARegister.tsx` - Composant d'enregistrement du Service Worker
- ✅ `app/layout.tsx` - Métadonnées PWA et intégration

## Comment tester l'application en mode offline

### 1. Démarrer l'application en mode production
```bash
npm run build
npm start
```

### 2. Installer la PWA

#### Sur ordinateur (Chrome/Edge) :
1. Ouvrez l'application dans votre navigateur
2. Cherchez l'icône d'installation dans la barre d'adresse (à droite)
3. Cliquez sur "Installer" ou "Ajouter à l'écran d'accueil"

#### Sur mobile (Android) :
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu (trois points)
3. Sélectionnez "Ajouter à l'écran d'accueil"
4. Confirmez l'installation

#### Sur mobile (iOS/Safari) :
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton "Partager" (carré avec flèche vers le haut)
3. Faites défiler et sélectionnez "Sur l'écran d'accueil"
4. Confirmez l'installation

### 3. Tester le mode offline

#### Méthode 1 : Utiliser les DevTools du navigateur
1. Ouvrez l'application dans votre navigateur
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet "Application" ou "Application"
4. Dans le menu de gauche, cliquez sur "Service Workers"
5. Cochez la case "Offline" pour simuler le mode hors ligne
6. Naviguez dans l'application - elle devrait fonctionner !

#### Méthode 2 : Désactiver réellement le réseau
1. Après avoir visité l'application une fois (pour mettre en cache les ressources)
2. Activez le mode avion sur votre appareil
3. Ou déconnectez-vous du WiFi/données mobiles
4. Ouvrez l'application depuis l'écran d'accueil
5. L'application devrait se charger et fonctionner !

### 4. Vérifier le Service Worker

Dans les DevTools :
1. Allez dans "Application" > "Service Workers"
2. Vous devriez voir le service worker actif pour votre domaine
3. Status: "activated and running"

### 5. Vérifier le cache

Dans les DevTools :
1. Allez dans "Application" > "Cache Storage"
2. Vous devriez voir deux caches :
   - `baraaka-v1` : Contient les ressources précachées
   - `baraaka-runtime-v1` : Contient les ressources chargées dynamiquement

## Stratégie de cache implémentée

L'application utilise une stratégie **Network First, fallback to Cache** :

1. **Pour les pages et ressources statiques** :
   - Essaie d'abord de charger depuis le réseau
   - Si le réseau échoue, utilise la version en cache
   - Met en cache les nouvelles ressources chargées avec succès

2. **Pour les requêtes API (`/api/*`)** :
   - Ne met PAS en cache les données pour éviter des données obsolètes
   - Retourne une erreur JSON si le réseau est indisponible
   - L'application peut gérer ces erreurs et afficher un message approprié

## Ressources précachées

Les URLs suivantes sont automatiquement mises en cache lors de l'installation :
- `/` - Page d'accueil
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Tableau de bord
- `/manifest.json` - Manifeste PWA

## Limitations du mode offline

⚠️ **Important** : En mode offline, les fonctionnalités suivantes ne seront pas disponibles :
- Synchronisation des données avec le serveur
- Appels API pour créer/modifier/supprimer des données
- Mise à jour en temps réel

Les données affichées seront celles qui étaient en cache au moment de la dernière connexion.

## Mises à jour de l'application

Lorsqu'une nouvelle version de l'application est déployée :
1. Le nouveau Service Worker est téléchargé en arrière-plan
2. L'utilisateur verra la nouvelle version au prochain rechargement de page
3. L'application se recharge automatiquement pour appliquer les mises à jour

## Désinstaller la PWA

### Sur ordinateur :
1. Ouvrez l'application installée
2. Menu > "Désinstaller Baraaka"

### Sur mobile :
1. Maintenez l'icône de l'application
2. Sélectionnez "Désinstaller" ou "Supprimer"

## Dépannage

### Le Service Worker ne s'enregistre pas
- Vérifiez que vous utilisez HTTPS (requis pour les Service Workers)
- Ou utilisez localhost pour le développement
- Vérifiez la console du navigateur pour les erreurs

### L'installation PWA n'apparaît pas
- Assurez-vous que le manifest.json est correctement chargé
- Vérifiez que toutes les icônes sont disponibles
- Le navigateur doit supporter les PWA (Chrome, Edge, Safari moderne)

### Les ressources ne se chargent pas offline
- Visitez d'abord l'application online pour mettre en cache les ressources
- Vérifiez que le Service Worker est activé dans les DevTools
- Vérifiez le Cache Storage pour voir ce qui est en cache

## Notes pour le développement

En mode développement (`npm run dev`), vous pouvez tester la PWA, mais :
- Les Service Workers peuvent être instables avec le Hot Reload
- Utilisez toujours le mode production pour les tests finaux
- Effacez le cache du navigateur entre les tests si nécessaire
