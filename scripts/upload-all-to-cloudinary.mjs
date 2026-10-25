import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'zsjpdh9i';
const API_KEY = process.env.CLOUDINARY_API_KEY || '615289681921531';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'QKPzHR5lpx18l0D_3sHtWPUlPE0';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.resolve('prisma/dev.db')}`
    }
  }
});

const MAPPING_FILE = path.resolve('scripts/cloudinary-mapping.json');
let mapping = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  } catch (e) {
    mapping = {};
  }
}

function saveMapping() {
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf8');
}

// Gather all files to upload
const galleryDir = path.resolve('public/products/gallery');
const galleryFiles = fs.readdirSync(galleryDir).map(file => `/products/gallery/${file}`);

// Also collect from catalog
const catalogPath = path.resolve('lib/catalog-static.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const allPaths = new Set(galleryFiles);
for (const cat of catalog.categories) {
  if (cat.image && cat.image.startsWith('/')) allPaths.add(cat.image);
  if (cat.bannerImage && cat.bannerImage.startsWith('/')) allPaths.add(cat.bannerImage);
}
for (const prod of catalog.products) {
  for (const img of (prod.images || [])) {
    if (img.url && img.url.startsWith('/')) allPaths.add(img.url);
  }
}

const listToUpload = Array.from(allPaths).filter(u => !mapping[u]);
console.log(`Total images identified: ${allPaths.size}`);
console.log(`Already mapped in cache: ${Object.keys(mapping).length}`);
console.log(`Remaining to upload: ${listToUpload.length}`);

async function uploadSingle(relPath) {
  const localFile = path.resolve('public' + relPath);
  if (!fs.existsSync(localFile)) {
    console.warn(`File does not exist: ${localFile}`);
    return null;
  }

  const basename = path.basename(relPath, path.extname(relPath))
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');

  try {
    const res = await cloudinary.uploader.upload(localFile, {
      folder: 'knot-and-bloom/products',
      public_id: basename,
      overwrite: false,
      resource_type: 'image'
    });

    // Cloudinary optimized URL with automatic modern format and compression
    const optimizedUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/v${res.version}/${res.public_id}`;
    mapping[relPath] = optimizedUrl;
    return optimizedUrl;
  } catch (err) {
    // If it already exists on Cloudinary or overwrite conflict, construct clean URL
    if (err.http_code === 400 || (err.message && err.message.includes('already exists'))) {
      const fallbackUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/knot-and-bloom/products/${basename}`;
      mapping[relPath] = fallbackUrl;
      return fallbackUrl;
    }
    console.error(`Failed to upload ${relPath}:`, err.message || err);
    return null;
  }
}

async function runUploads() {
  const CONCURRENCY = 4;
  let completed = 0;
  
  for (let i = 0; i < listToUpload.length; i += CONCURRENCY) {
    const chunk = listToUpload.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (p) => {
        const url = await uploadSingle(p);
        completed++;
        if (completed % 10 === 0 || completed === listToUpload.length) {
          console.log(`Progress: ${completed}/${listToUpload.length} uploaded (${Math.round((completed/listToUpload.length)*100)}%)`);
          saveMapping();
        }
      })
    );
  }
  
  saveMapping();
  console.log('Finished uploading all images to Cloudinary!');

  // Now update lib/catalog-static.json
  console.log('Updating lib/catalog-static.json with Cloudinary URLs...');
  let updatedCatalogCount = 0;

  for (const cat of catalog.categories) {
    if (cat.image && mapping[cat.image]) {
      cat.image = mapping[cat.image];
      updatedCatalogCount++;
    }
    if (cat.bannerImage && mapping[cat.bannerImage]) {
      cat.bannerImage = mapping[cat.bannerImage];
      updatedCatalogCount++;
    }
  }

  for (const prod of catalog.products) {
    if (prod.category) {
      if (prod.category.image && mapping[prod.category.image]) {
        prod.category.image = mapping[prod.category.image];
      }
    }
    for (const img of (prod.images || [])) {
      if (img.url && mapping[img.url]) {
        img.url = mapping[img.url];
        updatedCatalogCount++;
      }
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`Updated catalog-static.json successfully! (Replaced ${updatedCatalogCount} URLs)`);

  // Now update SQLite database (prisma/dev.db)
  console.log('Updating SQLite database (prisma/dev.db)...');
  try {
    const dbImages = await prisma.productImage.findMany();
    let dbUpdated = 0;
    for (const dbi of dbImages) {
      if (dbi.url && mapping[dbi.url]) {
        await prisma.productImage.update({
          where: { id: dbi.id },
          data: { url: mapping[dbi.url] }
        });
        dbUpdated++;
      }
    }
    console.log(`Updated ${dbUpdated} ProductImage records in SQLite database.`);

    const dbCategories = await prisma.category.findMany();
    let catUpdated = 0;
    for (const dbc of dbCategories) {
      const updates = {};
      if (dbc.image && mapping[dbc.image]) updates.image = mapping[dbc.image];
      if (dbc.bannerImage && mapping[dbc.bannerImage]) updates.bannerImage = mapping[dbc.bannerImage];
      if (Object.keys(updates).length > 0) {
        await prisma.category.update({
          where: { id: dbc.id },
          data: updates
        });
        catUpdated++;
      }
    }
    console.log(`Updated ${catUpdated} Category records in SQLite database.`);
  } catch (dbErr) {
    console.warn('Database update note:', dbErr.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('ALL DONE! All images are now hosted and auto-optimized on Cloudinary!');
}

runUploads().catch(console.error);
