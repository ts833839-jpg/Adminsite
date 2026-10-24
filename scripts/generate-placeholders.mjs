import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Generate luxury royal crochet SVG
function generateCrochetSvg({ title, category, color1 = '#380B12', color2 = '#4A0E17', accentColor = '#D4AF37', iconType = 'flower' }) {
  let centerIcon = '';

  if (iconType === 'lotus') {
    centerIcon = `
      <!-- Lotus Flower Petals -->
      <g transform="translate(400, 360)">
        <path d="M0,40 C-30,10 -60,-20 -70,-60 C-60,-90 -20,-110 0,-130 C20,-110 60,-90 70,-60 C60,-20 30,10 0,40 Z" fill="${accentColor}" opacity="0.9"/>
        <path d="M-20,40 C-60,15 -100,-5 -120,-45 C-115,-80 -80,-95 -50,-105 C-40,-70 -30,-40 -20,40 Z" fill="${accentColor}" opacity="0.75"/>
        <path d="M20,40 C60,15 100,-5 120,-45 C115,-80 80,-95 50,-105 C40,-70 30,-40 20,40 Z" fill="${accentColor}" opacity="0.75"/>
        <circle cx="0" cy="-30" r="16" fill="#F3E5AB"/>
        <circle cx="0" cy="-30" r="8" fill="#380B12"/>
      </g>
    `;
  } else if (iconType === 'potli') {
    centerIcon = `
      <!-- Royal Potli Bag -->
      <g transform="translate(400, 360)">
        <!-- Bag Neck & Tie -->
        <path d="M-60,-100 Q0,-120 60,-100 Q40,-60 -40,-60 Z" fill="${accentColor}" opacity="0.9"/>
        <!-- Drawstring knot -->
        <circle cx="0" cy="-70" r="10" fill="#F3E5AB"/>
        <line x1="-30" y1="-70" x2="-60" y2="-20" stroke="${accentColor}" stroke-width="4"/>
        <line x1="30" y1="-70" x2="60" y2="-20" stroke="${accentColor}" stroke-width="4"/>
        <circle cx="-60" cy="-20" r="8" fill="${accentColor}"/>
        <circle cx="60" cy="-20" r="8" fill="${accentColor}"/>
        <!-- Main body -->
        <path d="M-40,-60 C-110,0 -120,80 -70,120 C-30,145 30,145 70,120 C120,80 110,0 40,-60 Z" fill="${accentColor}" opacity="0.85"/>
        <circle cx="0" cy="40" r="28" fill="${color1}" stroke="${accentColor}" stroke-width="3"/>
        <circle cx="0" cy="40" r="12" fill="#F3E5AB"/>
      </g>
    `;
  } else if (iconType === 'wear') {
    centerIcon = `
      <!-- Royal Shrug / Capelet Motif -->
      <g transform="translate(400, 360)">
        <path d="M-120,-80 Q0,-110 120,-80 Q100,50 0,90 Q-100,50 -120,-80 Z" fill="${accentColor}" opacity="0.8"/>
        <path d="M-80,-50 Q0,-70 80,-50 Q60,30 0,60 Q-60,30 -80,-50 Z" fill="${color1}" opacity="0.6"/>
        <circle cx="0" cy="-40" r="14" fill="#F3E5AB"/>
      </g>
    `;
  } else if (iconType === 'flower') {
    centerIcon = `
      <!-- Crochet Rosette Flower -->
      <g transform="translate(400, 360)">
        <circle cx="0" cy="0" r="85" fill="${accentColor}" opacity="0.2"/>
        <circle cx="0" cy="0" r="65" fill="${accentColor}" opacity="0.4"/>
        <circle cx="0" cy="0" r="45" fill="${accentColor}" opacity="0.75"/>
        <circle cx="0" cy="0" r="24" fill="#F3E5AB"/>
        <circle cx="0" cy="0" r="10" fill="${color1}"/>
        <!-- Radiating stitches -->
        <line x1="0" y1="-95" x2="0" y2="95" stroke="${accentColor}" stroke-width="3" stroke-dasharray="6,4"/>
        <line x1="-95" y1="0" x2="95" y2="0" stroke="${accentColor}" stroke-width="3" stroke-dasharray="6,4"/>
        <line x1="-67" y1="-67" x2="67" y2="67" stroke="${accentColor}" stroke-width="3" stroke-dasharray="6,4"/>
        <line x1="67" y1="-67" x2="-67" y2="67" stroke="${accentColor}" stroke-width="3" stroke-dasharray="6,4"/>
      </g>
    `;
  } else if (iconType === 'plushie') {
    centerIcon = `
      <!-- Royal Elephant Silhouette -->
      <g transform="translate(400, 360)">
        <path d="M-50,60 L-50,20 C-70,10 -90,-10 -90,-40 C-90,-70 -60,-90 -20,-90 C30,-90 70,-60 80,-10 C90,10 90,60 90,60 L70,60 L70,30 L30,30 L30,60 L10,60 L10,20 L-30,20 L-30,60 Z" fill="${accentColor}" opacity="0.85"/>
        <path d="M-80,-20 C-100,-40 -110,-70 -110,-100 C-95,-100 -80,-80 -70,-60" stroke="${accentColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <!-- Saddle cloth -->
        <rect x="-10" y="-50" width="50" height="35" rx="6" fill="#F3E5AB" stroke="${color1}" stroke-width="2"/>
        <circle cx="15" cy="-32" r="6" fill="${color1}"/>
      </g>
    `;
  } else {
    // Mandala
    centerIcon = `
      <g transform="translate(400, 360)">
        <circle cx="0" cy="0" r="90" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="8,6"/>
        <circle cx="0" cy="0" r="70" fill="${accentColor}" opacity="0.3"/>
        <circle cx="0" cy="0" r="50" fill="none" stroke="#F3E5AB" stroke-width="3"/>
        <circle cx="0" cy="0" r="28" fill="${accentColor}" opacity="0.85"/>
        <circle cx="0" cy="0" r="10" fill="#FDFBF7"/>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="75%">
      <stop offset="0%" stop-color="${color2}"/>
      <stop offset="70%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="#140407"/>
    </radialGradient>
    <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3E5AB"/>
      <stop offset="50%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="#875314"/>
    </linearGradient>
    <!-- Crochet Stitch Pattern -->
    <pattern id="crochetStitch" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M0 15 Q15 0 30 15 Q15 30 0 15" fill="none" stroke="${accentColor}" stroke-width="0.8" opacity="0.16"/>
      <circle cx="15" cy="15" r="1.5" fill="${accentColor}" opacity="0.25"/>
    </pattern>
    <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="800" fill="url(#bgGrad)"/>
  <rect width="800" height="800" fill="url(#crochetStitch)"/>

  <!-- Palace Arch Border -->
  <rect x="35" y="35" width="730" height="730" rx="12" fill="none" stroke="url(#goldSheen)" stroke-width="2.5" opacity="0.75"/>
  <rect x="47" y="47" width="706" height="706" rx="8" fill="none" stroke="${accentColor}" stroke-width="0.8" stroke-dasharray="6,4" opacity="0.5"/>

  <!-- Ornate Corner Motifs -->
  <g stroke="${accentColor}" stroke-width="1.8" fill="none" opacity="0.8">
    <!-- Top Left -->
    <path d="M47,85 Q85,85 85,47"/>
    <circle cx="85" cy="85" r="4" fill="${accentColor}"/>
    <!-- Top Right -->
    <path d="M753,85 Q715,85 715,47"/>
    <circle cx="715" cy="85" r="4" fill="${accentColor}"/>
    <!-- Bottom Left -->
    <path d="M47,715 Q85,715 85,753"/>
    <circle cx="85" cy="715" r="4" fill="${accentColor}"/>
    <!-- Bottom Right -->
    <path d="M753,715 Q715,715 715,753"/>
    <circle cx="715" cy="715" r="4" fill="${accentColor}"/>
  </g>

  <!-- Central Ambient Mandala Halo -->
  <circle cx="400" cy="360" r="180" fill="none" stroke="${accentColor}" stroke-width="1" stroke-dasharray="4,8" opacity="0.3"/>
  <circle cx="400" cy="360" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.25"/>

  <!-- Central Illustrated Icon -->
  ${centerIcon}

  <!-- Brand & Product Banner Plaque -->
  <g transform="translate(400, 620)" text-anchor="middle">
    <!-- Plaque backdrop -->
    <rect x="-280" y="-35" width="560" height="90" rx="8" fill="#180509" stroke="url(#goldSheen)" stroke-width="1.5" opacity="0.95"/>
    <rect x="-274" y="-29" width="548" height="78" rx="6" fill="none" stroke="${accentColor}" stroke-width="0.7" stroke-dasharray="4,3" opacity="0.5"/>

    <!-- Category Tag -->
    <text y="-8" font-family="'Playfair Display', serif" font-size="14" fill="${accentColor}" letter-spacing="4" font-weight="600">
      KNOT & BLOOM • ${category.toUpperCase()}
    </text>

    <!-- Product Title -->
    <text y="24" font-family="'Playfair Display', Georgia, serif" font-size="20" fill="#FAF6F0" font-weight="700">
      ${title}
    </text>

    <!-- Artisan Seal Statement -->
    <text y="42" font-family="'Inter', sans-serif" font-size="11" fill="#C59B27" letter-spacing="1">
      100% HANDCRAFTED CROCHET • PURE YARN HEIRLOOM
    </text>
  </g>
</svg>`;
}

const productSvgs = [
  { file: 'crochet-lotus-keychain.svg', title: 'Royal Lotus Crochet Keychain', category: 'Handcrafted Keychain', iconType: 'lotus', color1: '#380B12', color2: '#58101E', accentColor: '#D4AF37' },
  { file: 'crochet-lotus-keychain-detail.svg', title: 'Lotus Keychain (Detail View)', category: 'Handcrafted Keychain', iconType: 'lotus', color1: '#2E080F', color2: '#4A0E17', accentColor: '#F3E5AB' },
  { file: 'crochet-peacock-charm.svg', title: 'Peacock Feather Royal Charm', category: 'Crochet Bag Charm', iconType: 'mandala', color1: '#102A43', color2: '#0B69A3', accentColor: '#D4AF37' },
  { file: 'crochet-sunflower-keychain.svg', title: 'Golden Sunflower Crochet Charm', category: 'Floral Keychain', iconType: 'flower', color1: '#4A2A05', color2: '#7E5F17', accentColor: '#E0BC5B' },
  { file: 'crochet-bodhi-charm.svg', title: 'Sacred Bodhi Leaf Charm', category: 'Car & Mirror Charm', iconType: 'lotus', color1: '#1C3322', color2: '#2F5D3A', accentColor: '#D4AF37' },
  { file: 'crochet-palace-potli.svg', title: 'Palace Jharokha Crochet Potli', category: 'Handcrafted Bags', iconType: 'potli', color1: '#380B12', color2: '#67121D', accentColor: '#D4AF37' },
  { file: 'crochet-palace-potli-interior.svg', title: 'Royal Potli (Interior View)', category: 'Handcrafted Bags', iconType: 'potli', color1: '#22050B', color2: '#380B12', accentColor: '#F3E5AB' },
  { file: 'crochet-heritage-tote.svg', title: 'Ivory Lace Heritage Tote Bag', category: 'Crochet Totes', iconType: 'potli', color1: '#2A2421', color2: '#4A3E39', accentColor: '#D4AF37' },
  { file: 'crochet-wine-clutch.svg', title: 'Zari-Trimmed Royal Clutch', category: 'Crochet Clutch', iconType: 'potli', color1: '#380B12', color2: '#4A0E17', accentColor: '#D4AF37' },
  { file: 'crochet-daisy-sling.svg', title: 'Daisy Crochet Mini Sling Bag', category: 'Floral Bags', iconType: 'flower', color1: '#3B3029', color2: '#57463C', accentColor: '#E0BC5B' },
  { file: 'crochet-burgundy-shrug.svg', title: 'Royal Burgundy Crochet Shrug', category: 'Handcrafted Wear', iconType: 'wear', color1: '#380B12', color2: '#58101E', accentColor: '#D4AF37' },
  { file: 'crochet-boho-top.svg', title: 'Cream Whisper Crochet Top', category: 'Festival Wear', iconType: 'wear', color1: '#2D2825', color2: '#4B423D', accentColor: '#D4AF37' },
  { file: 'crochet-gold-poncho.svg', title: 'Jaipur Gold Festival Poncho', category: 'Royal Wear', iconType: 'wear', color1: '#403010', color2: '#684E1A', accentColor: '#D4AF37' },
  { file: 'crochet-crimson-bouquet.svg', title: 'Everlasting Crimson Rose Bouquet', category: 'Everlasting Flowers', iconType: 'flower', color1: '#420B13', color2: '#751322', accentColor: '#D4AF37' },
  { file: 'crochet-marigold-toran.svg', title: 'Royal Marigold Crochet Toran', category: 'Festive Garland', iconType: 'flower', color1: '#542E06', color2: '#8C4E0B', accentColor: '#E0BC5B' },
  { file: 'crochet-tulip-bunch.svg', title: 'Spring Sunshine Crochet Tulips', category: 'Pastel Bouquet', iconType: 'flower', color1: '#2F1E2A', color2: '#5E3853', accentColor: '#D4AF37' },
  { file: 'crochet-mandala-hairpin.svg', title: 'Mandala Crochet Hair Pin Duo', category: 'Crochet Accessories', iconType: 'mandala', color1: '#380B12', color2: '#54101B', accentColor: '#D4AF37' },
  { file: 'crochet-gold-choker.svg', title: 'Antique Gold Thread Choker', category: 'Crochet Jewellery', iconType: 'mandala', color1: '#2E2211', color2: '#543F1D', accentColor: '#D4AF37' },
  { file: 'crochet-pearl-jhumka.svg', title: 'Pearl Droplet Crochet Jhumkas', category: 'Crochet Earrings', iconType: 'mandala', color1: '#380B12', color2: '#4A0E17', accentColor: '#D4AF37' },
  { file: 'crochet-scrunchie-set.svg', title: 'Royal Silk & Cotton Scrunchies', category: 'Hair Accessories', iconType: 'flower', color1: '#380B12', color2: '#58101E', accentColor: '#D4AF37' },
  { file: 'crochet-mandala-coasters.svg', title: 'Palace Mandala Crochet Coasters', category: 'Home & Living', iconType: 'mandala', color1: '#380B12', color2: '#4A0E17', accentColor: '#D4AF37' },
  { file: 'crochet-table-runner.svg', title: 'Wine & Gold Crochet Table Runner', category: 'Royal Dining Decor', iconType: 'mandala', color1: '#380B12', color2: '#54101B', accentColor: '#D4AF37' },
  { file: 'crochet-cushion-cover.svg', title: 'Jaipuri Textured Cushion Cover', category: 'Home Furnishing', iconType: 'mandala', color1: '#262220', color2: '#423A36', accentColor: '#D4AF37' },
  { file: 'crochet-wall-hanging.svg', title: 'Palace Dreamer Wall Hanging', category: 'Wall Tapestry', iconType: 'mandala', color1: '#29221C', color2: '#473B32', accentColor: '#D4AF37' },
  { file: 'crochet-baby-elephant.svg', title: 'Gajaraj Royal Baby Elephant', category: 'Crochet Amigurumi', iconType: 'plushie', color1: '#380B12', color2: '#54101B', accentColor: '#D4AF37' },
  { file: 'crochet-ganesha-figurine.svg', title: 'Festive Ganesha Keepsake', category: 'Auspicious Keepsake', iconType: 'lotus', color1: '#542E06', color2: '#8C4E0B', accentColor: '#E0BC5B' },
  { file: 'crochet-bunny-plushie.svg', title: 'Moonlight Bunny Soft Plushie', category: 'Amigurumi Plushie', iconType: 'plushie', color1: '#2B2328', color2: '#4A3B45', accentColor: '#D4AF37' },
  { file: 'crochet-rosebud-bookmark.svg', title: 'Rosebud Blossom Page Marker', category: 'Crochet Bookmark', iconType: 'flower', color1: '#380B12', color2: '#54101B', accentColor: '#D4AF37' },
  { file: 'crochet-lavender-pouch.svg', title: 'Lavender Garden Scented Pouch', category: 'Aromatherapy Pouch', iconType: 'flower', color1: '#261F2E', color2: '#463757', accentColor: '#D4AF37' },
  { file: 'crochet-emerald-brooch.svg', title: 'Emerald Bloom Artisan Brooch', category: 'Royal Brooch', iconType: 'flower', color1: '#0F2B1D', color2: '#1C4D35', accentColor: '#D4AF37' },
  { file: 'placeholder-royal.svg', title: 'Knot & Bloom Handcrafted Treasure', category: 'Luxury Crochet', iconType: 'lotus', color1: '#380B12', color2: '#4A0E17', accentColor: '#D4AF37' },
];

for (const p of productSvgs) {
  const content = generateCrochetSvg(p);
  fs.writeFileSync(path.join(outputDir, p.file), content, 'utf8');
}

// User avatars
const adminAvatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#380B12"/>
  <circle cx="50" cy="50" r="46" fill="none" stroke="#D4AF37" stroke-width="2"/>
  <circle cx="50" cy="38" r="16" fill="#F3E5AB"/>
  <path d="M22,82 C22,64 35,58 50,58 C65,58 78,64 78,82 Z" fill="#D4AF37"/>
</svg>`;
fs.writeFileSync(path.join(avatarsDir, 'admin.svg'), adminAvatar, 'utf8');

const priyaAvatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#4A0E17"/>
  <circle cx="50" cy="50" r="46" fill="none" stroke="#D4AF37" stroke-width="2"/>
  <circle cx="50" cy="38" r="16" fill="#F5E6BF"/>
  <path d="M22,82 C22,64 35,58 50,58 C65,58 78,64 78,82 Z" fill="#C98A90"/>
</svg>`;
fs.writeFileSync(path.join(avatarsDir, 'priya.svg'), priyaAvatar, 'utf8');

console.log(`Generated ${productSvgs.length} luxury crochet SVG placeholders in public/products/ and avatars in public/avatars/`);
