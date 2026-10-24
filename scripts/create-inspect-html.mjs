import fs from 'fs';
import path from 'path';

const galleryDir = 'D:/Ramazon/public/products/gallery';
const files = fs.readdirSync(galleryDir);

const pngs = files.filter(f => f.endsWith('.png')).sort();
const jpegs = files.filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg')).sort();
const others = files.filter(f => !f.endsWith('.png') && !f.endsWith('.jpeg') && !f.endsWith('.jpg')).sort();

let html = `<!DOCTYPE html>
<html>
<head>
  <title>Gallery Inventory</title>
  <style>
    body { font-family: sans-serif; background: #111; color: #eee; padding: 20px; }
    h2 { color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 8px; margin-top: 40px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .card { background: #1c1c1c; border-radius: 8px; overflow: hidden; border: 1px solid #333; }
    .card img { width: 100%; height: 220px; object-fit: cover; display: block; }
    .card .title { padding: 8px 12px; font-size: 12px; word-break: break-all; }
  </style>
</head>
<body>
  <h1>Knot & Bloom Image Inventory (${files.length} Total Files)</h1>
  
  <h2>1. ChatGPT Enhanced Images (${pngs.length} PNGs)</h2>
  <div class="grid">
    ${pngs.map(p => `
      <div class="card">
        <img src="/products/gallery/${encodeURIComponent(p)}" loading="lazy" />
        <div class="title">${p}</div>
      </div>
    `).join('')}
  </div>

  <h2>2. WhatsApp Direct Photos (${jpegs.length} JPEGs)</h2>
  <div class="grid">
    ${jpegs.map(j => `
      <div class="card">
        <img src="/products/gallery/${encodeURIComponent(j)}" loading="lazy" />
        <div class="title">${j}</div>
      </div>
    `).join('')}
  </div>

  <h2>3. Other Media (${others.length})</h2>
  <div class="grid">
    ${others.map(o => `
      <div class="card">
        <div class="title" style="padding: 20px;">${o}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync('D:/Ramazon/public/inspect_all.html', html);
console.log('Created public/inspect_all.html');
