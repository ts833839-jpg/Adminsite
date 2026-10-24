import fs from 'fs';
import path from 'path';

const srcDir = 'D:/Ramazon/images';
const destDir = 'D:/Ramazon/public/products/gallery';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function cleanFilename(name) {
  return name
    .toLowerCase()
    .replace(/whatsapp image 2026-10-24 at /g, 'wa-')
    .replace(/whatsapp video 2026-10-24 at /g, 'wa-video-')
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

const files = fs.readdirSync(srcDir);
const manifest = {};

for (const file of files) {
  const src = path.join(srcDir, file);
  // Ensure original file is in gallery
  const origDest = path.join(destDir, file);
  if (!fs.existsSync(origDest)) {
    fs.copyFileSync(src, origDest);
  }

  // Create clean web-friendly filename
  const cleanName = cleanFilename(file);
  const cleanDest = path.join(destDir, cleanName);
  if (!fs.existsSync(cleanDest)) {
    fs.copyFileSync(src, cleanDest);
  }

  manifest[file] = {
    original: file,
    cleanName: cleanName,
    url: `/products/gallery/${cleanName}`,
    encodedOriginalUrl: `/products/gallery/${encodeURIComponent(file)}`,
  };
}

fs.writeFileSync('D:/Ramazon/scripts/gallery-manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Generated manifest for ${Object.keys(manifest).length} assets.`);
console.log('Sample mapping:', Object.entries(manifest)[0]);
