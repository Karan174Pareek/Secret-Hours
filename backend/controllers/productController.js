import Product from '../models/Product.js';
import { determineGstRate } from '../services/gstEngine.js';

export const productController = {
  // Public Catalog with filters and search
  async getProducts(req, res, next) {
    try {
      const {
        collection,
        category,
        fabric,
        minPrice,
        maxPrice,
        sort = 'featured',
        search,
      } = req.query;

      const filter = { isActive: true };

      if (collection) {
        filter.collectionName = { $regex: new RegExp(collection, 'i') };
      }
      if (category && category !== 'all') {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (fabric) {
        filter.fabric = { $regex: new RegExp(fabric, 'i') };
      }
      if (minPrice || maxPrice) {
        filter.basePricePaise = {};
        if (minPrice) filter.basePricePaise.$gte = Number(minPrice) * 100;
        if (maxPrice) filter.basePricePaise.$lte = Number(maxPrice) * 100;
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { fabric: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOptions = { isFeatured: -1, createdAt: -1 };
      if (sort === 'price_asc') sortOptions = { basePricePaise: 1 };
      if (sort === 'price_desc') sortOptions = { basePricePaise: -1 };
      if (sort === 'newest') sortOptions = { createdAt: -1 };

      const products = await Product.find(filter).sort(sortOptions);
      res.json({ success: true, count: products.length, products });
    } catch (err) {
      next(err);
    }
  },

  // Single Product Detail by Slug
  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({ slug, isActive: true });
      if (!product) {
        return res.status(404).json({ error: true, message: 'Garment not found in atelier catalog' });
      }

      // Related products from same collection
      const related = await Product.find({
        collectionName: product.collectionName,
        _id: { $ne: product._id },
        isActive: true,
      }).limit(4);

      res.json({ success: true, product, related });
    } catch (err) {
      next(err);
    }
  },

  // Admin Create Product
  async createProduct(req, res, next) {
    try {
      const data = req.body;
      if (!data.title) {
        return res.status(400).json({ error: true, message: 'Garment title is required.' });
      }

      const basePaise = Math.round(Number(data.basePricePaise || (data.basePriceRupees ? data.basePriceRupees * 100 : 0)));
      if (!basePaise || basePaise <= 0) {
        return res.status(400).json({ error: true, message: 'Valid base price is required.' });
      }

      const dynamicGstRate = determineGstRate(basePaise);

      let slug = data.slug;
      if (!slug && data.title) {
        slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
      }

      let images = Array.isArray(data.images)
        ? data.images
        : (data.imageUrl ? [data.imageUrl] : (data.image ? [data.image] : []));
      if (!images.length) {
        images = ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80'];
      }

      const sizes = Array.isArray(data.sizes) && data.sizes.length
        ? data.sizes
        : [
            { size: 'XS', stock: 2 },
            { size: 'S', stock: 4 },
            { size: 'M', stock: 5 },
            { size: 'L', stock: 3 },
            { size: 'Custom Bespoke', stock: 10 },
          ];

      const colors = Array.isArray(data.colors) && data.colors.length
        ? data.colors
        : [
            { name: data.colorName || 'Imperial Gold', hex: data.colorHex || '#C59B27', modelColor: '#C59B27' },
          ];

      const product = new Product({
        title: data.title.trim(),
        slug,
        collectionName: data.collectionName || 'The Royal Noor',
        category: data.category || 'couture',
        basePricePaise: basePaise,
        hsn: data.hsn || (basePaise <= 250000 ? '6214' : '6204'),
        gstRate: dynamicGstRate,
        fabric: data.fabric || 'Pure Mulberry Silk & Handloom Zari',
        care: data.care || 'Specialist dry clean only. Store wrapped in unbleached muslin.',
        craftHours: Number(data.craftHours) || 180,
        description: data.description || 'An architectural couture creation meticulously needlecrafted by master artisans.',
        images,
        sizes,
        colors,
        isFeatured: Boolean(data.isFeatured),
        isActive: true,
      });

      await product.save();
      res.status(201).json({ success: true, message: 'Garment added to atelier catalog.', product });
    } catch (err) {
      next(err);
    }
  },

  // Admin Update Product
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.basePriceRupees) {
        updates.basePricePaise = Math.round(Number(updates.basePriceRupees) * 100);
      }
      if (updates.basePricePaise) {
        updates.gstRate = determineGstRate(updates.basePricePaise);
      }

      const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).json({ error: true, message: 'Product not found' });
      }
      res.json({ success: true, product });
    } catch (err) {
      next(err);
    }
  },

  // Admin Delete Product (Permanently remove or archive)
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ error: true, message: 'Product not found' });
      }
      res.json({ success: true, message: `Garment "${product.title}" removed from catalog.` });
    } catch (err) {
      next(err);
    }
  },
};

export default productController;
