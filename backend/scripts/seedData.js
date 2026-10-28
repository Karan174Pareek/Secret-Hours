import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Pincode from '../models/Pincode.js';
import AdminUser from '../models/AdminUser.js';
import { determineGstRate } from '../services/gstEngine.js';

dotenv.config();

const PRODUCTS = [
  // --- Collection 1: The Royal Noor Bridal ---
  {
    title: 'Chand-Taara Royal Zardozi Bridal Lehenga',
    slug: 'chand-taara-bridal-lehenga',
    collectionName: 'The Royal Noor',
    category: 'couture',
    basePricePaise: 14500000, // Rs 1,45,000
    hsn: '6204',
    fabric: 'Pure Mulberry Silk with Electroplated Real Silver Zari',
    care: 'Specialist dry clean only. Store wrapped in pure unbleached muslin with natural cedar sachet.',
    craftHours: 420,
    description: 'An architectural heirloom bridal masterpiece featuring antique beaten gold wire embroidery (zardozi), marodi threadwork, and hand-cut sequins draped over a 16-kali sculpted mulberry silk skirt.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 4 },
      { size: 'M', stock: 3 },
      { size: 'L', stock: 2 },
      { size: 'Custom Bespoke', stock: 10 },
    ],
    colors: [
      { name: 'Imperial Gold & Ivory', hex: '#C59B27', modelColor: '#C59B27' },
      { name: 'Royal Crimson', hex: '#8B1E1E', modelColor: '#8B1E1E' },
    ],
    isFeatured: true,
  },
  {
    title: 'Gul-e-Bahar Hand-Embroidered Silk Ensemble',
    slug: 'gul-e-bahar-silk-ensemble',
    collectionName: 'The Royal Noor',
    category: 'couture',
    basePricePaise: 11500000, // Rs 1,15,000
    hsn: '6204',
    fabric: 'Raw Silk & Fine French Wire',
    care: 'Dry clean only. Avoid spraying perfumes directly on metal zari work.',
    craftHours: 360,
    description: 'A tribute to Mughal botanicals rendered in micro-pearls, tilla cord, and basra pearl detailing across a tailored bodice and flared volume skirt.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 },
    ],
    colors: [
      { name: 'Antique Rose', hex: '#B87D7B', modelColor: '#B87D7B' },
      { name: 'Onyx Gold', hex: '#141210', modelColor: '#141210' },
    ],
    isFeatured: true,
  },
  {
    title: 'Shahana Velvet Zardozi Ensemble',
    slug: 'shahana-velvet-ensemble',
    collectionName: 'The Royal Noor',
    category: 'couture',
    basePricePaise: 18500000, // Rs 1,85,000
    hsn: '6204',
    fabric: 'Micro-Velvet & Tissue Dupatta',
    care: 'Professional couture dry clean only.',
    craftHours: 480,
    description: 'Heavy architectural velvet lehenga structured with internal horsehair braid and weighted with hand-beaded dabka border motifs.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'S', stock: 2 },
      { size: 'M', stock: 2 },
      { size: 'L', stock: 1 },
    ],
    colors: [
      { name: 'Deep Aubergine', hex: '#3B1E2B', modelColor: '#3B1E2B' },
    ],
    isFeatured: false,
  },
  {
    title: 'Mumtaz Pale Gold Zari Bridal Lehenga',
    slug: 'mumtaz-pale-gold-bridal-lehenga',
    collectionName: 'The Royal Noor',
    category: 'couture',
    basePricePaise: 21000000, // Rs 2,10,000
    hsn: '6204',
    fabric: 'Pure Tissue Brocade with 24k Gold Dip Plating',
    care: 'Vacuum clean by certified couture conservators.',
    craftHours: 520,
    description: 'The pinnacle of ZARIYA bridal couture. Crafted from hand-woven tissue brocade and embellished with uncut stone and pitta metal embroidery.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'S', stock: 1 },
      { size: 'M', stock: 2 },
      { size: 'Custom Bespoke', stock: 5 },
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#DFC896', modelColor: '#DFC896' },
    ],
    isFeatured: true,
  },

  // --- Collection 2: Aaranya Metamorphosis (Draped Sarees) ---
  {
    title: 'Aaranya Pleated Metallic Tissue Saree',
    slug: 'metallic-tissue-draped-saree',
    collectionName: 'Aaranya Metamorphosis',
    category: 'sarees',
    basePricePaise: 4200000, // Rs 42,000
    hsn: '6214',
    fabric: 'Metallic Tissue & Japanese Pleated Organza',
    care: 'Do not iron directly. Steam only on reverse with protective cloth.',
    craftHours: 120,
    description: 'Pre-draped statement saree engineered with micro-accordion pleating that cascades gracefully into an ethereal metallic palla.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'One Size / Pre-Draped', stock: 8 },
      { size: 'Custom Waist', stock: 5 },
    ],
    colors: [
      { name: 'Liquid Platinum', hex: '#D1D5DB', modelColor: '#D1D5DB' },
      { name: 'Burnished Copper', hex: '#B45309', modelColor: '#B45309' },
    ],
    isFeatured: true,
  },
  {
    title: 'Maya Emerald Organza Cocktail Saree',
    slug: 'maya-emerald-organza-saree',
    collectionName: 'Aaranya Metamorphosis',
    category: 'sarees',
    basePricePaise: 3850000, // Rs 38,500
    hsn: '6214',
    fabric: 'Translucent Silk Organza with Gota Patti Border',
    care: 'Dry clean only. Steam with low temperature.',
    craftHours: 95,
    description: 'Weightless hand-woven silk organza saree in deep jewel emerald, framed with delicate cutwork gota patti and hand-sewn glass crystals.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'Standard (6.5 Metres)', stock: 6 },
    ],
    colors: [
      { name: 'Jewel Emerald', hex: '#064E3B', modelColor: '#064E3B' },
    ],
    isFeatured: false,
  },
  {
    title: 'Devnaagari Sculpted Corset & Draped Saree',
    slug: 'sculpted-corset-palazzo-set',
    collectionName: 'Aaranya Metamorphosis',
    category: 'sarees',
    basePricePaise: 4800000, // Rs 48,000
    hsn: '6211',
    fabric: 'Raw Silk Corsetry & Draped Crepe Silk',
    care: 'Dry clean only.',
    craftHours: 160,
    description: 'A contemporary silhouette combining a boned structural corset blouse with a fluid, fluid-movement pre-stitched draped skirt saree.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 4 },
      { size: 'M', stock: 3 },
      { size: 'L', stock: 2 },
    ],
    colors: [
      { name: 'Midnight Onyx', hex: '#141210', modelColor: '#141210' },
      { name: 'Ivory Zari', hex: '#FAF8F5', modelColor: '#FAF8F5' },
    ],
    isFeatured: true,
  },
  {
    title: 'Tarunya Concept Pleated Pant Saree',
    slug: 'tarunya-pant-saree',
    collectionName: 'Aaranya Metamorphosis',
    category: 'sarees',
    basePricePaise: 3200000, // Rs 32,000
    hsn: '6214',
    fabric: 'Georgette & Crepe de Chine',
    care: 'Dry clean only.',
    craftHours: 85,
    description: 'Modern red-carpet crossover pant saree with integrated sash pleats and embroidered waist cincher belt.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 2 },
    ],
    colors: [
      { name: 'Burnt Sienna', hex: '#9A3412', modelColor: '#9A3412' },
    ],
    isFeatured: false,
  },

  // --- Collection 3: Vanya Imperial Silk (Menswear & Pret) ---
  {
    title: 'Vanya Imperial Raw Silk Embroidered Sherwani',
    slug: 'vanya-raw-silk-sherwani',
    collectionName: 'Vanya Imperial Silk',
    category: 'menswear',
    basePricePaise: 8500000, // Rs 85,000
    hsn: '6203',
    fabric: 'Pure Hand-Spun Matka Silk & Gold Wire',
    care: 'Professional dry clean only.',
    craftHours: 280,
    description: 'Architecturally tailored ceremonial sherwani with tonal resham embroidery, customized horn buttons, and handcrafted silk churidar.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: '38 (S)', stock: 3 },
      { size: '40 (M)', stock: 5 },
      { size: '42 (L)', stock: 3 },
      { size: '44 (XL)', stock: 2 },
    ],
    colors: [
      { name: 'Raw Ivory', hex: '#FAF8F5', modelColor: '#FAF8F5' },
      { name: 'Regal Navy', hex: '#1E293B', modelColor: '#1E293B' },
    ],
    isFeatured: true,
  },
  {
    title: 'Zaffran Matka Silk Asymmetric Bandhgala',
    slug: 'zaffran-asymmetric-bandhgala',
    collectionName: 'Vanya Imperial Silk',
    category: 'menswear',
    basePricePaise: 4600000, // Rs 46,000
    hsn: '6203',
    fabric: 'Matka Silk with Cast Brass Buttons',
    care: 'Dry clean only.',
    craftHours: 140,
    description: 'Sculpted asymmetric wrap bandhgala with subtle geometric shoulder tucks and concealed placket.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: '38', stock: 2 },
      { size: '40', stock: 4 },
      { size: '42', stock: 2 },
    ],
    colors: [
      { name: 'Saffron Rust', hex: '#C2410C', modelColor: '#C2410C' },
      { name: 'Slate Charcoal', hex: '#334155', modelColor: '#334155' },
    ],
    isFeatured: false,
  },

  // --- GST 5% Boundary Demonstration Pieces (<= Rs 2,500) ---
  {
    title: 'Imperial Chanderi Silk Tunic Ensemble',
    slug: 'chanderi-handloom-kurta-ensemble',
    collectionName: 'Atelier Pret',
    category: 'pret',
    basePricePaise: 240000, // Rs 2,400 (<= Rs 2,500 => 5% GST!)
    hsn: '6204',
    fabric: 'Handloom Chanderi Silk with Zari Edge',
    care: 'Hand wash cold with gentle silk detergent.',
    craftHours: 35,
    description: 'Lightweight handloom tunic ensemble crafted in Madhya Pradesh Chanderi clusters, adorned with a delicate woven zari border.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 },
    ],
    colors: [
      { name: 'Pearl Sand', hex: '#E7E5E4', modelColor: '#E7E5E4' },
      { name: 'Muted Terracotta', hex: '#A16207', modelColor: '#A16207' },
    ],
    isFeatured: true,
  },
  {
    title: 'Pashmina & Zari Border Evening Stole',
    slug: 'pashmina-zari-evening-stole',
    collectionName: 'Atelier Pret',
    category: 'pret',
    basePricePaise: 220000, // Rs 2,200 (<= Rs 2,500 => 5% GST!)
    hsn: '6214',
    fabric: 'Fine Cashmere-Silk Blend & Zari Fringe',
    care: 'Dry clean only.',
    craftHours: 24,
    description: 'Hand-woven ultra-fine evening stole featuring traditional paisley motifs and hand-knotted zari tassel edges.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    ],
    model3d: null,
    sizes: [
      { size: 'One Size (2.2m x 0.8m)', stock: 25 },
    ],
    colors: [
      { name: 'Zari Champagne', hex: '#CA8A04', modelColor: '#CA8A04' },
      { name: 'Charcoal Black', hex: '#1C1917', modelColor: '#1C1917' },
    ],
    isFeatured: true,
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
  { pincode: '190001', city: 'Lal Chowk / Srinagar', state: 'Jammu & Kashmir', stateCode: '01', isServiceable: true, isCodAllowed: false, estimatedDays: 5 }, // Prepaid only demo
];

async function seed() {
  await connectDB();

  console.log('[Seed] Clearing existing collections...');
  await Product.deleteMany({});
  await Pincode.deleteMany({});
  await AdminUser.deleteMany({});

  console.log('[Seed] Seeding 12 couture products...');
  for (const p of PRODUCTS) {
    const rate = determineGstRate(p.basePricePaise);
    await Product.create({ ...p, gstRate: rate });
  }

  console.log('[Seed] Seeding pincodes allow/deny list...');
  await Pincode.insertMany(PINCODES);

  console.log('[Seed] Seeding administrator account...');
  const { salt, passwordHash } = AdminUser.hashPassword('ZariyaAtelier2026!');
  await AdminUser.create({
    email: 'admin@zariyaatelier.com',
    passwordHash,
    salt,
    name: 'Atelier Director',
    role: 'admin',
  });

  console.log('\n========================================');
  console.log('✅ SEEDING COMPLETE');
  console.log('12 Products across 3 Collections seeded');
  console.log('11 Key Pincodes seeded (including prepaid-only 190001)');
  console.log('Admin Account: admin@zariyaatelier.com (Pass: ZariyaAtelier2026!)');
  console.log('========================================\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
