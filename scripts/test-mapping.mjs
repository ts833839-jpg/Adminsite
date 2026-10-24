import fs from 'fs';
import path from 'path';

const galleryDir = 'D:/Ramazon/public/products/gallery';
const allFiles = fs.readdirSync(galleryDir);

const pngs = allFiles.filter(f => f.endsWith('.png'));
const jpegs = allFiles.filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));

console.log(`Total PNGs: ${pngs.length}`);
console.log(`Total JPEGs: ${jpegs.length}`);
console.log(`Total Images: ${pngs.length + jpegs.length}`);
