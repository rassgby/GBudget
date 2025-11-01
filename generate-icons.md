# Génération des icônes PWA

Pour générer les icônes PWA de différentes tailles à partir du fichier `public/icon.svg`, vous pouvez utiliser l'une des méthodes suivantes :

## Méthode 1 : Utiliser un outil en ligne
1. Allez sur https://realfavicongenerator.net/ ou https://www.pwabuilder.com/imageGenerator
2. Uploadez votre fichier `public/icon.svg`
3. Téléchargez les icônes générées
4. Placez-les dans le dossier `public/icons/`

## Méthode 2 : Utiliser ImageMagick (en ligne de commande)
```bash
# Installer ImageMagick si nécessaire
# sudo apt-get install imagemagick

# Générer les différentes tailles
for size in 72 96 128 144 152 192 384 512; do
  convert public/icon.svg -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

## Méthode 3 : Utiliser un script Node.js avec sharp
```bash
npm install sharp
node scripts/generate-icons.js
```

## Icônes requises
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Pour le moment, l'application utilisera l'icône SVG par défaut jusqu'à ce que vous génériez les PNG.
