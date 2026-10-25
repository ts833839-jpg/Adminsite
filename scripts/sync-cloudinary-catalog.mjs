import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'zsjpdh9i',
  api_key: process.env.CLOUDINARY_API_KEY || '615289681921531',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QKPzHR5lpx18l0D_3sHtWPUlPE0',
  secure: true,
});

async function sync() {
  const localCatalogPath = path.resolve('lib/catalog-static.json');
  const cat = JSON.parse(fs.readFileSync(localCatalogPath, 'utf8'));

  // Ensure "new" product from admin screenshot is present
  const hasNew = cat.products.some((p) => p.name === 'new' || p.sku === 'KB-CR-6401');
  if (!hasNew) {
    const category = cat.categories.find((c) => c.id === 'cmvmiccn0000ad7hu2nfzrl36') || cat.categories[0];
    const newProduct = {
      id: 'cmv-new-creation-001',
      name: 'new',
      slug: 'new-crochet-creation',
      subtitle: 'Artisan Bespoke Crochet Wear',
      description: 'best product',
      details: '{"Technique":"Handcrafted Crochet","Artisan":"Knot & Bloom Atelier"}',
      materials: '100% Combed Cotton Yarn, Fine Metallic Accents',
      dimensions: 'Standard artisan scale',
      careInstructions: 'Gentle cold handwash, dry flat in shade',
      categoryId: category.id,
      price: 0,
      mrp: 0,
      discountPercent: 0,
      stock: 1,
      sku: 'KB-CR-6401',
      rating: 5.0,
      reviewCount: 0,
      isActive: true,
      isFeatured: true,
      badge: 'NEW',
      tags: 'crochet, handcrafted, bespoke',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        {
          id: 'img-new-001',
          url: 'https://res.cloudinary.com/zsjpdh9i/image/upload/v1792914991/knot-and-bloom/products/whatsapp-image-2026-10-24-at-4-57-47-pm-1341.jpg',
          isPrimary: true,
          order: 0,
        },
      ],
      category,
      variants: [],
    };
    cat.products.unshift(newProduct);
    if (category._count) {
      category._count.products += 1;
    }
  }

  // Save locally
  fs.writeFileSync(localCatalogPath, JSON.stringify(cat, null, 2), 'utf8');

  // Upload to Cloudinary CDN
  const base64 = Buffer.from(JSON.stringify(cat, null, 2)).toString('base64');
  const uploadRes = await cloudinary.uploader.upload(
    `data:application/json;base64,${base64}`,
    {
      resource_type: 'raw',
      public_id: 'knot-and-bloom/catalog.json',
      overwrite: true,
      invalidate: true,
    }
  );

  console.log('✅ Live Cloudinary catalog synced!');
  console.log('Total products:', cat.products.length);
  console.log('Cloudinary CDN URL:', uploadRes.secure_url);
}

sync().catch(console.error);
