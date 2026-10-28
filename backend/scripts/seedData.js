import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Pincode from '../models/Pincode.js';
import AdminUser from '../models/AdminUser.js';
import Category from '../models/Category.js';
import { determineGstRate } from '../services/gstEngine.js';

dotenv.config();

const CATEGORIES = [
  { name: 'Structural Corsetry', slug: 'corsetry', description: 'Architectural bodices and sculpted steel-boned corsets', displayOrder: 1 },
  { name: 'Fluid Drapes & Slips', slug: 'slips', description: 'Bias-cut mulberry silk slips and draped cowl gowns', displayOrder: 2 },
  { name: 'Tailored Rebel Outerwear', slug: 'outerwear', description: 'Oversized structured blazers and cropped statement trenches', displayOrder: 3 },
  { name: 'Contradiction Separates', slug: 'separates', description: 'Wide-leg pleat trousers, organza shirts, and fine knitwear', displayOrder: 4 },
  { name: 'Atelier Accessories', slug: 'accessories', description: 'Discreet minimal leather bags, stoles, and printed silk scarves', displayOrder: 5 },
];

const PRODUCTS = [
  // --- Debut Collection 01: UNBECOMING ---
  {
    title: 'The Unbecoming Sculpted Corset',
    slug: 'the-unbecoming-sculpted-corset',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'corsetry',
    basePricePaise: 1450000, // Rs 14,500 (18% GST)
    hsn: '6211',
    fabric: 'Structured Wool-Crepe & Internal Steel Boning',
    care: 'Specialist dry clean only. Store flat in bespoke garment pouch.',
    craftHours: 120,
    description: 'An architectural sculpted corset embodying the tension between restraint and freedom. Features contoured boning channels, clean square neckline, and concealed back eyelet closure with contrast edge finishing.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 6 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 },
      { size: 'Custom Bespoke', stock: 10 },
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Warm Ivory', hex: '#F7F4EF', modelColor: '#F7F4EF' },
    ],
    isFeatured: true,
  },
  {
    title: 'The Contradiction Bias-Cut Silk Slip',
    slug: 'the-contradiction-bias-cut-silk-slip',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'slips',
    basePricePaise: 1850000, // Rs 18,500 (18% GST)
    hsn: '6204',
    fabric: '100% Pure Mulberry Silk Satin',
    care: 'Dry clean in specialized solvent. Iron reverse on low silk setting.',
    craftHours: 85,
    description: 'A fluid silhouette that moves effortlessly against the skin. Cut on the true bias with delicate double-spaghetti straps, low draped cowl back, and raw-edged hand-finished hemline.',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 7 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 4 },
    ],
    colors: [
      { name: 'Soft Champagne', hex: '#E9DFD2', modelColor: '#E9DFD2' },
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Muted Mocha', hex: '#78645D', modelColor: '#78645D' },
    ],
    isFeatured: true,
  },
  {
    title: 'Midnight Rebel Oversized Tailored Blazer',
    slug: 'midnight-rebel-oversized-tailored-blazer',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'outerwear',
    basePricePaise: 2400000, // Rs 24,000 (18% GST)
    hsn: '6204',
    fabric: 'Double-Faced Italian Wool & Bemberg Silk Cupro Lining',
    care: 'Dry clean only. Hang on wide contoured wooden hanger.',
    craftHours: 110,
    description: 'Sharply tailored masculine shoulder silhouette softened with deep front break. Features elongated peak lapels, horn buttons, interior passport pocket, and subtle contrast edge topstitching.',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 },
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Muted Mocha', hex: '#78645D', modelColor: '#78645D' },
    ],
    isFeatured: true,
  },
  {
    title: 'The Inside Joke Cropped Trench',
    slug: 'the-inside-joke-cropped-trench',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'outerwear',
    basePricePaise: 1650000, // Rs 16,500 (18% GST)
    hsn: '6204',
    fabric: 'Weather-Resistant Compact Cotton Twill',
    care: 'Professional dry clean only.',
    craftHours: 95,
    description: 'A playful, rebellious reinterpretation of classic British trench architecture. Cropped at high waistline with exaggerated gun flaps, double-buckle storm collar, and tortoiseshell horn buttons.',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 5 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 2 },
    ],
    colors: [
      { name: 'Soft Champagne', hex: '#E9DFD2', modelColor: '#E9DFD2' },
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
    ],
    isFeatured: true,
  },
  {
    title: 'Soft Champagne Fluid Pleat Trouser',
    slug: 'soft-champagne-fluid-pleat-trouser',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'separates',
    basePricePaise: 1100000, // Rs 11,000 (18% GST)
    hsn: '6204',
    fabric: 'Heavyweight Silk-Viscose Fluid Crepe',
    care: 'Dry clean only. Cool iron.',
    craftHours: 65,
    description: 'High-waisted wide-leg trousers tailored with deep inverted front pleats, hidden in-seam pockets, and an effortlessly relaxed silhouette that falls with liquid grace.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 6 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 3 },
    ],
    colors: [
      { name: 'Soft Champagne', hex: '#E9DFD2', modelColor: '#E9DFD2' },
      { name: 'Warm Ivory', hex: '#F7F4EF', modelColor: '#F7F4EF' },
    ],
    isFeatured: false,
  },
  {
    title: 'The Unlearning Sheer Organza Shirt',
    slug: 'the-unlearning-sheer-organza-shirt',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'separates',
    basePricePaise: 980000, // Rs 9,800 (18% GST)
    hsn: '6206',
    fabric: '100% Pure Mulberry Silk Organza',
    care: 'Dry clean only. Steam delicately on reverse.',
    craftHours: 70,
    description: 'Translucent button-down shirt with exaggerated French cuffs and architectural pointed collar. Explores the boundary between what is revealed and what is kept private.',
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 5 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 2 },
    ],
    colors: [
      { name: 'Warm Ivory', hex: '#F7F4EF', modelColor: '#F7F4EF' },
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
    ],
    isFeatured: false,
  },

  // --- Capsule 02: THE NIGHT HOURS ---
  {
    title: 'The Night Hours Draped Velvet Gown',
    slug: 'the-night-hours-draped-velvet-gown',
    collectionName: 'The Night Hours',
    category: 'slips',
    basePricePaise: 3200000, // Rs 32,000 (18% GST)
    hsn: '6204',
    fabric: 'Silk Micro-Velvet & Liquid Satin Lining',
    care: 'Specialist couture dry clean only.',
    craftHours: 140,
    description: 'Sculptural column evening gown with an open cowl back and high side slit. Holds a subtle rebellious attitude for the night hours when you dress solely for yourself.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 2 },
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Muted Mocha', hex: '#78645D', modelColor: '#78645D' },
    ],
    isFeatured: true,
  },
  {
    title: 'The Unapologetic Contour Bodysuit',
    slug: 'the-unapologetic-contour-bodysuit',
    collectionName: 'The Night Hours',
    category: 'corsetry',
    basePricePaise: 240000, // Rs 2,400 (5% GST Slab Tier: <= Rs 2,500)
    hsn: '6114',
    fabric: 'Compression Stretch Satin & Sheer Mesh Paneling',
    care: 'Gentle hand wash cold or delicate dry clean.',
    craftHours: 40,
    description: 'Sculpted contour bodysuit engineered for seamless versatility. Transitions effortlessly from under oversized tailoring in daylight to after-hours statement wear.',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 4 },
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Warm Ivory', hex: '#F7F4EF', modelColor: '#F7F4EF' },
    ],
    isFeatured: true,
  },

  // --- Capsule 03: BETWEEN US (Pret & Essentials) ---
  {
    title: 'Muted Mocha Rebellious Rib Knit Top',
    slug: 'muted-mocha-rebellious-rib-knit-top',
    collectionName: 'Between Us',
    category: 'separates',
    basePricePaise: 220000, // Rs 2,200 (5% GST Slab Tier: <= Rs 2,500)
    hsn: '6109',
    fabric: 'Fine Merino Wool & Cashmere Rib Blend',
    care: 'Hand wash cold with wool detergent. Dry flat.',
    craftHours: 35,
    description: 'Second-skin asymmetrical rib-knit top with extended thumbhole sleeves and slash-neckline detail. Perfectly balances effortless comfort with quiet attitude.',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 6 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 },
    ],
    colors: [
      { name: 'Muted Mocha', hex: '#78645D', modelColor: '#78645D' },
      { name: 'Soft Champagne', hex: '#E9DFD2', modelColor: '#E9DFD2' },
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
    ],
    isFeatured: true,
  },
  {
    title: 'The Confession Silk Bandana Scarf',
    slug: 'the-confession-silk-bandana-scarf',
    collectionName: 'Between Us',
    category: 'accessories',
    basePricePaise: 180000, // Rs 1,800 (5% GST Slab Tier: <= Rs 2,500)
    hsn: '6214',
    fabric: '100% Silk Twill with Hand-Rolled Edges',
    care: 'Dry clean only.',
    craftHours: 25,
    description: 'Printed silk twill scarf with cryptic typography and Secret Hours micro-motifs. Can be styled tied around the collar, hair, or handbag strap.',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'One Size (55x55cm)', stock: 25 },
    ],
    colors: [
      { name: 'Midnight & Champagne', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Mocha & Ivory', hex: '#78645D', modelColor: '#78645D' },
    ],
    isFeatured: true,
  },
  {
    title: 'The Secret Society Leather Shoulder Bag',
    slug: 'the-secret-society-leather-shoulder-bag',
    collectionName: 'Between Us',
    category: 'accessories',
    basePricePaise: 1250000, // Rs 12,500 (18% GST)
    hsn: '4202',
    fabric: 'Full-Grain Italian Calf Leather & Brushed Palladium Hardware',
    care: 'Store in protective flannel dust bag. Wipe with clean dry cloth.',
    craftHours: 55,
    description: 'Sleek crescent shoulder bag with discreet blind-debossed monogram and magnetic closure. Conceals an interior pocket foil-stamped with: "We trust you with our secret."',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'One Size', stock: 8 },
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Muted Mocha', hex: '#78645D', modelColor: '#78645D' },
    ],
    isFeatured: true,
  },
  {
    title: 'Asymmetrical Sculpted Midi Skirt',
    slug: 'asymmetrical-sculpted-midi-skirt',
    collectionName: 'Unbecoming (Col. 01)',
    category: 'separates',
    basePricePaise: 850000, // Rs 8,500 (18% GST)
    hsn: '6204',
    fabric: 'Structured Japanese Cupro-Twill',
    care: 'Dry clean only.',
    craftHours: 60,
    description: 'Flattering bias-cut midi skirt with diagonal seam architecture and subtle flare that moves with kinetic fluidity at every step.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 5 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 3 },
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1D1B1A', modelColor: '#1D1B1A' },
      { name: 'Soft Champagne', hex: '#E9DFD2', modelColor: '#E9DFD2' },
    ],
    isFeatured: false,
  },
];

const PINCODES = [
  { pincode: '734001', city: 'Sevoke Road / Siliguri', state: 'West Bengal', stateCode: '19', isServiceable: true, isCodAllowed: true, estimatedDays: 1 },
  { pincode: '734005', city: 'Pradhan Nagar / Siliguri', state: 'West Bengal', stateCode: '19', isServiceable: true, isCodAllowed: true, estimatedDays: 1 },
  { pincode: '734008', city: 'Hakim Para / Siliguri', state: 'West Bengal', stateCode: '19', isServiceable: true, isCodAllowed: true, estimatedDays: 1 },
  { pincode: '700001', city: 'BBD Bagh / Kolkata', state: 'West Bengal', stateCode: '19', isServiceable: true, isCodAllowed: true, estimatedDays: 2 },
  { pincode: '110016', city: 'South Delhi / Hauz Khas', state: 'Delhi', stateCode: '07', isServiceable: true, isCodAllowed: true, estimatedDays: 2 },
  { pincode: '110001', city: 'Connaught Place / Central Delhi', state: 'Delhi', stateCode: '07', isServiceable: true, isCodAllowed: true, estimatedDays: 2 },
  { pincode: '400001', city: 'Fort / South Mumbai', state: 'Maharashtra', stateCode: '27', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '400050', city: 'Bandra West / Mumbai', state: 'Maharashtra', stateCode: '27', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '560001', city: 'MG Road / Bengaluru', state: 'Karnataka', stateCode: '29', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '500034', city: 'Banjara Hills / Hyderabad', state: 'Telangana', stateCode: '36', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '302001', city: 'C-Scheme / Jaipur', state: 'Rajasthan', stateCode: '08', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '600002', city: 'Anna Salai / Chennai', state: 'Tamil Nadu', stateCode: '33', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '380009', city: 'Navrangpura / Ahmedabad', state: 'Gujarat', stateCode: '24', isServiceable: true, isCodAllowed: true, estimatedDays: 3 },
  { pincode: '190001', city: 'Lal Chowk / Srinagar', state: 'Jammu & Kashmir', stateCode: '01', isServiceable: true, isCodAllowed: false, estimatedDays: 5 },
];

async function seed() {
  await connectDB();

  console.log('[Seed] Clearing existing collections...');
  await Product.deleteMany({});
  await Pincode.deleteMany({});
  await AdminUser.deleteMany({});
  await Category.deleteMany({});

  console.log('[Seed] Seeding 5 official Secret Hours categories...');
  await Category.insertMany(CATEGORIES);

  console.log('[Seed] Seeding 12 contemporary Secret Hours garments...');
  for (const p of PRODUCTS) {
    const rate = determineGstRate(p.basePricePaise);
    await Product.create({ ...p, gstRate: rate });
  }

  console.log('[Seed] Seeding pincodes list...');
  await Pincode.insertMany(PINCODES);

  console.log('[Seed] Seeding administrator accounts...');
  const admin1 = AdminUser.hashPassword('SecretHours2026!');
  await AdminUser.create({
    email: 'admin@secrethours.com',
    passwordHash: admin1.passwordHash,
    salt: admin1.salt,
    name: 'Secret Hours Director',
    role: 'admin',
  });

  const admin2 = AdminUser.hashPassword('ZariyaAtelier2026!');
  await AdminUser.create({
    email: 'admin@zariyaatelier.com',
    passwordHash: admin2.passwordHash,
    salt: admin2.salt,
    name: 'Atelier Director',
    role: 'admin',
  });

  console.log('\n========================================');
  console.log('✅ SECRET HOURS SEEDING COMPLETE');
  console.log('12 Pieces across Unbecoming, Night Hours & Between Us seeded');
  console.log('5 Categories seeded (Corsetry, Slips, Outerwear, Separates, Accessories)');
  console.log('14 Pincodes seeded (Siliguri, Kolkata, Delhi, Mumbai, etc.)');
  console.log('Admin: admin@secrethours.com (Pass: SecretHours2026!)');
  console.log('========================================\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
