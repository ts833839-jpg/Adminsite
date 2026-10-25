import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'zsjpdh9i',
  api_key: process.env.CLOUDINARY_API_KEY || '615289681921531',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QKPzHR5lpx18l0D_3sHtWPUlPE0',
  secure: true,
});

export const CLOUDINARY_CATALOG_URL =
  'https://res.cloudinary.com/zsjpdh9i/raw/upload/knot-and-bloom/catalog.json';

export async function getLiveCatalog(): Promise<{ categories: any[]; products: any[] }> {
  try {
    const res = await fetch(`${CLOUDINARY_CATALOG_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch from Cloudinary CDN, falling back to bundled catalog:', err);
  }

  try {
    const staticData = await import('@/lib/catalog-static.json');
    return {
      categories: staticData.categories || [],
      products: staticData.products || [],
    };
  } catch (e) {
    return { categories: [], products: [] };
  }
}

export async function addProductToLiveCatalog(newProduct: any): Promise<void> {
  try {
    const current = await getLiveCatalog();
    const updatedProducts = [
      newProduct,
      ...current.products.filter((p: any) => p.id !== newProduct.id && p.sku !== newProduct.sku),
    ];

    const updatedCategories = current.categories.map((c: any) => {
      if (c.id === newProduct.categoryId && c._count) {
        return { ...c, _count: { ...c._count, products: (c._count.products || 0) + 1 } };
      }
      return c;
    });

    const payload = {
      categories: updatedCategories,
      products: updatedProducts,
    };

    const base64 = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');
    await cloudinary.uploader.upload(`data:application/json;base64,${base64}`, {
      resource_type: 'raw',
      public_id: 'knot-and-bloom/catalog.json',
      overwrite: true,
      invalidate: true,
    });
    console.log('✅ Real-time Cloudinary catalog updated with new product:', newProduct.name);
  } catch (err) {
    console.error('Failed to sync new product to Cloudinary catalog:', err);
  }
}
