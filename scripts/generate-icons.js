import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = fs.readFileSync(path.resolve('./public/icon.svg'));

async function generateIcons() {
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');
  console.log('Generated pwa-192x192.png');

  // 512x512 standard
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');
  console.log('Generated pwa-512x512.png');

  // 180x180 apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');

  // Maskable 512x512 with safe-zone margin (15% padding with full-bleed background)
  const innerIcon = await sharp(svgBuffer)
    .resize(384, 384) // ~75% of 512
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 13, g: 148, b: 136, alpha: 1 }, // teal-600
    },
  })
    .composite([{ input: innerIcon, gravity: 'center' }])
    .png()
    .toFile('./public/pwa-maskable-512x512.png');
  console.log('Generated pwa-maskable-512x512.png');

  // Favicon 32x32 png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('./public/favicon.ico');
  console.log('Generated favicon.ico');
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
