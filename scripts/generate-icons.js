/*
 * One-off script: generates the PWA icon set from public/assets/navLogo.png.
 * Run with:  node scripts/generate-icons.js
 * Output goes to public/icons/. Safe to re-run.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, '..', 'public', 'assets', 'navLogo.png');
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');

const BG = '#ecf0f3'; // site background, used as the maskable safe-zone fill

// Standard PWA icons. 192 + 512 are the minimum PWABuilder requires.
const ICONS = [
  { size: 192, file: 'icon-192.png', maskable: false },
  { size: 512, file: 'icon-512.png', maskable: false },
  { size: 180, file: 'apple-touch-icon-180.png', maskable: false },
  // Maskable icon: logo placed inside the "safe zone" (central ~80%) on a
  // solid background so Android adaptive shapes (circle/squircle) don't crop it.
  { size: 512, file: 'icon-512-maskable.png', maskable: true },
];

async function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error('Source icon not found: ' + SOURCE);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { size, file, maskable } of ICONS) {
    const dest = path.join(OUT_DIR, file);
    if (maskable) {
      // Fill background, then composite the logo scaled to 70% of the canvas
      // (keeps it well within the 80% safe zone for adaptive icons).
      const inner = Math.round(size * 0.7);
      const resized = await sharp(SOURCE)
        .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: BG,
        },
      })
        .composite([{ input: resized, gravity: 'center' }])
        .png()
        .toFile(dest);
    } else {
      await sharp(SOURCE)
        .resize(size, size, { fit: 'contain', background: BG })
        .png()
        .toFile(dest);
    }
    console.log('generated', file, size + 'x' + size, maskable ? '(maskable)' : '');
  }
  console.log('Done ->', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
