import fs from 'fs';
import path from 'path';

const dir = 'D:/Ramazon/images';
const files = fs.readdirSync(dir);

const pngs = files.filter(f => f.endsWith('.png')).sort();
const jpegs = files.filter(f => f.endsWith('.jpeg')).sort();

console.log(`PNGs (${pngs.length}):`);
pngs.forEach(p => console.log(' - ' + p));

console.log(`\nJPEGs (${jpegs.length}):`);
jpegs.forEach(j => {
  const stat = fs.statSync(path.join(dir, j));
  console.log(` - ${j} (${stat.size} bytes)`);
});
