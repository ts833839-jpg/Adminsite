import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning regional/state names and badges from database...');

  // 1. Update Categories
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    let desc = cat.description || '';
    desc = desc
      .replace(/Jaipur heritage/gi, 'Artisan handcrafted')
      .replace(/Jaipur/gi, 'Atelier')
      .replace(/Rajasthan(i)?/gi, 'Artisan')
      .replace(/Gujarat(i)?/gi, 'Artisan')
      .replace(/Indian/gi, 'Handcrafted');

    await prisma.category.update({
      where: { id: cat.id },
      data: { description: desc },
    });
  }
  console.log('Categories sanitized.');

  // 2. Update Products
  const products = await prisma.product.findMany();
  console.log(`Processing ${products.length} products...`);

  for (const p of products) {
    let name = p.name
      .replace(/Jaipur Heritage/gi, 'Heirloom')
      .replace(/Jaipur/gi, 'Atelier')
      .replace(/Maharani/gi, 'Heirloom')
      .replace(/Rajasthani/gi, 'Artisan')
      .replace(/Rajasthan/gi, 'Artisan')
      .replace(/Gujarati/gi, 'Artisan')
      .replace(/Gujarat/gi, 'Artisan')
      .replace(/Indian/gi, 'Artisan');

    let desc = (p.description || '')
      .replace(/royal Jaipur artisan crochet/gi, 'master artisan handcrafted crochet')
      .replace(/Jaipur craft/gi, 'artisan craft')
      .replace(/Jaipur crochet craftsmanship/gi, 'artisan crochet craftsmanship')
      .replace(/Jaipur Atelier/gi, 'Artisan Atelier')
      .replace(/Jaipur Collective/gi, 'Artisan Collective')
      .replace(/Jaipur/gi, 'Atelier')
      .replace(/traditional Rajasthani rangoli and folk motifs/gi, 'traditional geometric and botanical motifs')
      .replace(/traditional Rajasthani rangolis/gi, 'radiant floral mandalas')
      .replace(/Rajasthan(i)?/gi, 'Artisan')
      .replace(/Gujarat(i)?/gi, 'Artisan')
      .replace(/Indian/gi, 'pure');

    let subtitle = (p.subtitle || '')
      .replace(/Jaipur/gi, 'Atelier')
      .replace(/Rajasthan/gi, 'Artisan')
      .replace(/Gujarat/gi, 'Artisan')
      .replace(/Indian/gi, 'Artisan');

    let details = p.details || '';
    if (details) {
      details = details
        .replace(/Jaipur Atelier/gi, 'Artisan Atelier')
        .replace(/Jaipur Collective/gi, 'Artisan Studio')
        .replace(/Rajasthan Collective/gi, 'Artisan Collective')
        .replace(/Indian Organic Cotton/gi, 'Pure Organic Cotton')
        .replace(/Jaipur/gi, 'Artisan Studio')
        .replace(/Rajasthan/gi, 'Artisan Studio')
        .replace(/Gujarat/gi, 'Artisan Studio');
    }

    let materials = (p.materials || '')
      .replace(/Indian/gi, 'Pure')
      .replace(/Jaipur/gi, 'Artisan');

    await prisma.product.update({
      where: { id: p.id },
      data: {
        name,
        description: desc,
        subtitle,
        details,
        materials,
        badge: null, // Remove all BESTSELLER, TRENDING, NEW badges
        isBestSeller: false,
        isTrending: false,
        isNewArrival: false,
        isFeatured: false,
      },
    });
  }

  console.log('All products updated and cleared of state/regional tags and badges.');
}

main().finally(() => prisma.$disconnect());
