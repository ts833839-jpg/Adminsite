import fs from 'fs';
import path from 'path';

const srcDir = 'D:/Ramazon/images';
const destDir = 'D:/Ramazon/public/products/gallery';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
console.log(`Found ${files.length} items in ${srcDir}`);

const chatgptFiles = [];
const whatsappImages = [];
const otherFiles = [];

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.png') {
    chatgptFiles.push(file);
  } else if (ext === '.jpeg' || ext === '.jpg') {
    whatsappImages.push(file);
  } else {
    otherFiles.push(file);
  }
}

console.log(`ChatGPT Enhanced PNGs: ${chatgptFiles.length}`);
console.log(`WhatsApp Direct JPEGs: ${whatsappImages.length}`);
console.log(`Other files: ${otherFiles.length} (${otherFiles.join(', ')})`);

// Copy all files to public/products/gallery if not already there
let copiedCount = 0;
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    copiedCount++;
  }
}
console.log(`Copied ${copiedCount} files to ${destDir}`);
