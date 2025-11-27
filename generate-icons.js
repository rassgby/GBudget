const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, 'public', 'icons');
const svgPath = path.join(iconDir, 'icon.svg');

async function generateIcons() {
  console.log('Génération des icônes PWA...');
  
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const size of sizes) {
    const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Créé: icon-${size}x${size}.png`);
  }
  
  // Créer aussi un favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon.png'));
  console.log('✓ Créé: favicon.png');
  
  // Créer favicon.ico
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.join(__dirname, 'public', 'favicon.ico'));
  console.log('✓ Créé: favicon.ico');
  
  console.log('\n✅ Toutes les icônes ont été générées!');
}

generateIcons().catch(console.error);
