// Script pour générer les icônes PWA de différentes tailles
// Exécuter avec: node scripts/generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const svgPath = path.join(__dirname, '../public/icon.svg');

async function generateIcons() {
  console.log('🎨 Génération des icônes PWA...\n');

  for (const size of sizes) {
    const outputPath = path.join(__dirname, `../public/icon-${size}x${size}.png`);

    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Généré: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Erreur pour icon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n✅ Toutes les icônes ont été générées avec succès!');
}

generateIcons().catch(console.error);

