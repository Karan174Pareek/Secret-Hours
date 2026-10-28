import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true }, // 'XS', 'S', 'M', 'L', 'XL', 'Custom'
  stock: { type: Number, required: true, default: 5, min: 0 },
});

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  modelColor: { type: String, default: '#C59B27' }, // For 3D viewer material tint
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    collectionName: { type: String, required: true, index: true }, // e.g. 'The Royal Noor', 'Aaranya Metamorphosis', 'Vanya Imperial Silk'
    category: { type: String, required: true, index: true }, // 'couture', 'sarees', 'pret', 'menswear'
    
    // Taxable (GST-exclusive) base price in paise per piece (INTEGER)
    basePricePaise: { type: Number, required: true, min: 0 },
    
    // HSN code for GST compliance (e.g. '6204', '6214', '6203', '6211')
    hsn: { type: String, required: true, default: '6204' },
    
    // Dynamic GST Rate evaluated based on pre-tax price threshold
    gstRate: { type: Number, required: true, default: 0.18 },
    
    description: { type: String, required: true },
    fabric: { type: String, required: true },
    care: { type: String, default: 'Dry clean only in specialized solvent. Store wrapped in pure unbleached muslin.' },
    craftHours: { type: Number, default: 240 },
    
    images: [{ type: String, required: true }],
    model3d: { type: String, default: null }, // Optional .glb path/URL
    
    sizes: [sizeSchema],
    colors: [colorSchema],
    
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual for rupee equivalent
productSchema.virtual('basePriceRupees').get(function () {
  return this.basePricePaise / 100;
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
